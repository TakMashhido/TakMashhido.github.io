import numpy as np

rng = np.random.default_rng(seed=1)
N_STAGES = 64

def features(challenges):
    """Map 0/1 challenges (rows) to the parity feature vector Φ of the additive delay model."""
    signs = 1 - 2 * challenges                        # 0 -> +1, 1 -> -1
    phi = np.cumprod(signs[:, ::-1], axis=1)[:, ::-1]  # Φ_i = Π_{j>=i} (1 - 2c_j)
    return np.hstack([phi, np.ones((len(challenges), 1))])  # + bias term

class ArbiterPUF:
    def __init__(self, n=N_STAGES, noise=0.05, rng=rng):
        self.w = rng.normal(size=n + 1)   # stage delay differences, fixed at manufacture
        self.noise, self.rng = noise, rng

    def respond(self, challenges, noisy=True):
        delta = features(challenges) @ self.w
        if noisy:
            delta += self.rng.normal(scale=self.noise * np.linalg.norm(self.w), size=len(delta))
        return (delta > 0).astype(int)

def hamming(a, b):
    return np.mean(a != b)

chip_a, chip_b = ArbiterPUF(), ArbiterPUF()
C = rng.integers(0, 2, size=(128, N_STAGES))

print(f"same chip, two reads : {hamming(chip_a.respond(C), chip_a.respond(C)):.3f}")
print(f"chip A vs chip B     : {hamming(chip_a.respond(C), chip_b.respond(C)):.3f}")

# --- Modelling attack: learn w from eavesdropped CRPs with logistic regression ---
def train_logreg(X, y, epochs=300, lr=0.5):
    w = np.zeros(X.shape[1])
    for _ in range(epochs):
        p = 1 / (1 + np.exp(-X @ w))
        w -= lr * X.T @ (p - y) / len(y)
    return w

C_train = rng.integers(0, 2, size=(2000, N_STAGES))
C_test = rng.integers(0, 2, size=(5000, N_STAGES))
w_hat = train_logreg(features(C_train), chip_a.respond(C_train, noisy=False))
pred = (features(C_test) @ w_hat > 0).astype(int)
print(f"clone accuracy       : {np.mean(pred == chip_a.respond(C_test, noisy=False)):.3f}")

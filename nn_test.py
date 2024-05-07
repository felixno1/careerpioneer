from src.CareerPioneer import predict_jobs

words = [
    "python",
    "git",
    "c#",
    "design",
    "prototyping"
    ]

hej = predict_jobs(words, 5)

print(hej)
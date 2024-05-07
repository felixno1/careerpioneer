from src.CareerPioneer import predict_jobs

words = [
    "python",
    "git",
    "c#",
    "java",
    "prototyping"
    ]

hej = predict_jobs(words, 5)

print(hej)
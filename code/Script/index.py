import sys
import json
import spacy

# Load English tokenizer, tagger, parser, NER, and word vectors
nlp = spacy.load("en_core_web_sm")

# Function to load dataset from a JSON file
def load_dataset_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data["treatments"]  # Access the "treatments" array from the JSON data

# Define the dataset file path
dataset_file_path = r'C:\Users\advaidh\Desktop\pree proj\data.json'

# Load the dataset
treatment_data = load_dataset_from_json(dataset_file_path)

# Function to retrieve treatment information based on the identified issues
def get_treatments_for_issues(issues):
    treatments = set()
    for issue in issues:
        for treatment in treatment_data:
            if issue in treatment["treats"]:
                treatments.add((treatment["name"], treatment["description"]))
    return list(treatments)

# Function to analyze user input and identify mental health issues
def analyze_user_input(user_input):
    doc = nlp(user_input.lower())
    issues = []
    for token in doc:
        if token.text in ["depression", "anxiety", "ptsd", "bipolar disorder", "schizophrenia", "adhd"]:
            issues.append(token.text.capitalize())
    return issues

# Function to generate a response
def generate_response(user_input):
    issues = analyze_user_input(user_input)
    if issues:
        treatments = get_treatments_for_issues(issues)
        if treatments:
            response = f"Based on your input, here are some treatments that may help with {' '.join(issues)}:\n\n"
            for treatment in treatments:
                response += f"- {treatment[0]}:\n  {treatment[1]}\n\n\n"
        else:
            response = "Sorry, I couldn't find treatments for the identified issues."
    else:
        response = "I'm here to help you find mental health treatments. Please describe how you're feeling."
    return response

# Main function to handle command-line arguments
def main():
    # Check if the script is called with a message argument
    if len(sys.argv) > 1:
        user_input = ' '.join(sys.argv[1:])
        response = generate_response(user_input)
        print(response)
    else:
        print("Usage: python script_name.py <message>")

if __name__ == "__main__":
    main()

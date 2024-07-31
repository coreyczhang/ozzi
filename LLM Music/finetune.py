
import openai

def open_file(filepath):
    with open(filepath,'r', encoding='utf-8') as infile:
        return infile.read()


def save_file(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as outfile: 
        outfile.write(content)

api_key = open_file('apikey.txt')
openai.api_key = api_key

with open("D:\My Stuff\Research Project\LLM\chorales.jsonl", "rb") as file:
    response = openai.File.create(
        file=file, 
        purpose='fine-tune'
    )
file_id = response['id']
print("File uploaded successfully with ID: {file_id}")
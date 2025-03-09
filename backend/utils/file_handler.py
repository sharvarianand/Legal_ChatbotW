import os

def save_file(file, directory):
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, file.filename)
    file.save(file_path)
    
    # Log the file save action
    print(f"File saved to {file_path}")
    
    return file_path

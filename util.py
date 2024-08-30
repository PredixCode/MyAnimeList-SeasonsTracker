import json

def jsonifyAndSafe(dict, save_path):
    with open(save_path, 'w') as f:
        json.dump(dict, f)
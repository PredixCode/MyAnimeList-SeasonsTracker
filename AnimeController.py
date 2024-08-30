import os
import webbrowser
import threading
import logging

from flask import Flask, jsonify, send_file
from werkzeug.serving import make_server

from MalRequests import Requester


logging.basicConfig(level=logging.DEBUG)



class AnimeController:
    def __init__(self, anime_repo, requester):
        self.anime_repo = anime_repo
        self.requester = requester
        self.server = None
        self.app = Flask(__name__)

        self.build_flask()

        # Start the Flask server in a separate thread
        threading.Thread(target=self.run_flask).start()

        # Open the web browser
        webbrowser.open_new('http://127.0.0.1:5000/')

    def build_flask(self):
        @self.app.route('/')
        def index():
            try:
                # Full path to your index.html
                full_path = os.path.join(os.getcwd(), 'src', 'webapp', 'index.html')
                return send_file(full_path)
            except Exception as e:
                logging.error(f"Error rendering template: {e}")
                return str(e), 500
            
        @self.app.route('/animes')
        def animes():
            try:
                anime_objs_json = {} 
                for anime in self.anime_repo.get_all_animes():
                    anime_objs_json[anime.id] = anime.to_dict()

                return jsonify(anime_objs_json)

            except Exception as e:
                logging.error(f"Error rendering template: {e}")
                return str(e), 500   

        @self.app.route('/user_animes')
        def user_animes():
            try:
                return jsonify(self.anime_repo.user_anime_list)

            except Exception as e:
                logging.error(f"Error rendering template: {e}")
                return str(e), 500  
            
        @self.app.route('/refresh_user_list_status')
        def refresh_user_list_status():
            try:
                self.requester.get_user_anime_list()
                print("REFRESHED USER LIST AND USER LIST STATUS")
                return "SUCCESSFUL"

            except Exception as e:
                logging.error(f"Error rendering template: {e}")
                return str(e), 500  

        @self.app.route('/lineage_data')
        def lineage_data():
            try:
                lineage = self.anime_repo.generate_anime_seasons_liniage()
                return jsonify(lineage)
            except Exception as e:
                logging.error(f"Error generating lineage data: {e}")
                return str(e), 500

    def run_flask(self):
        self.server = make_server('localhost', 5000, self.app)
        self.server.serve_forever()


import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Crear la aplicación de Flask
app = Flask(__name__)

# Habilitar CORS para permitir peticiones desde el frontend
CORS(app)

# Configurar la carpeta de subidas
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asegurarse de que la carpeta de subidas existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Ruta de prueba para verificar que el servidor funciona
@app.route('/')
def hello_world():
    return jsonify({'message': '¡Hola! El servidor de Flask está funcionando.'})

# Ruta para subir un archivo
@app.route('/upload', methods=['POST'])
def upload_file():
    # Verificar si la petición POST tiene la parte del archivo
    if 'file' not in request.files:
        return jsonify({'error': 'No se encontró el campo del archivo en la petición'}), 400
    file = request.files['file']
    # Si el usuario no selecciona un archivo, el navegador
    # podría enviar una parte vacía sin nombre de archivo.
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
    if file:
        # secure_filename sanea el nombre del archivo para evitar problemas de seguridad
        filename = secure_filename(file.filename)
        # Guardar el archivo en la carpeta de subidas
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'message': 'Archivo subido correctamente', 'filename': filename}), 200

# Ruta para obtener la lista de archivos
@app.route('/files', methods=['GET'])
def list_files():
    try:
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        # Opcional: filtrar archivos ocultos (como .DS_Store en macOS)
        visible_files = [f for f in files if not f.startswith('.')]
        return jsonify(visible_files)
    except FileNotFoundError:
        return jsonify([])

# Ruta para servir/ver los archivos subidos
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# Iniciar el servidor
if __name__ == '__main__':
    # Usamos 0.0.0.0 para que sea accesible desde fuera del contenedor
    # Usamos un puerto diferente al de Node.js para evitar conflictos
    app.run(host='0.0.0.0', port=5001, debug=True)

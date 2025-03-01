import fs from 'fs';
import path from 'path';
import readline from 'readline';

const __dirname = path.resolve();

// Configura readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const formatearCamposTable = (campos) => {

    return campos.map(campo => {
        return {
            title: formatearCampoLabel(campo),
            value: campo,
        };
    });
};

const formatearCamposFormCreate = (campos) => {

    let state = {};

    campos.forEach(campo => {
        state[campo] = 'undefined';
    });

    const stateText = `{ ${Object.entries(state).map(([key, value]) => `${key}: ${value}`).join(',\n')} }`; // Agrega un salto de línea aquí
    return stateText;

};

const objectSchema = (campos) => {
    let esquema = {};

    campos.forEach(campo => {
        esquema[campo] = 'string().required("Este campo es requerido")';
    });

    const schemaText = `object({ ${Object.entries(esquema).map(([key, value]) => `${key}: ${value}`).join(',\n')} })`; // Agrega un salto de línea aquí
    return schemaText;
};

const askQuestions = async () => {
    try {
        const modelo = await question('Ingrese el nombre del directorio PascalCase (Ej: UsuarioConfiguracion): ');
        if (!modelo) throw new Error("El nombre del directorio no puede estar vacío.");

        const camposInput = await question('Ingrese los nombres de los campos separados por coma (Ej: nombre,apellido,segundo_nombre): ');
        if (!camposInput) throw new Error("Los campos no pueden estar vacíos.");

        const url = await question('Ingrese la url de la API (Ejemplo: /api/user_configuracion): ');
        if (!url) throw new Error("La url no puede estar vacía.");

        const camposSinFiltrar = camposInput.split(',').map(campo => campo.trim());

        const campos = camposSinFiltrar.filter(campo => campo !== '');

        const modeloMinusculas = modelo.toLowerCase();

        const directory = `./pages/${pluralizar(modeloMinusculas)}`;

        const directoryViews = `./views/pages/${pluralizar(modeloMinusculas)}`;

        const directoryTypes = `./types/${pluralizar(modeloMinusculas)}`;

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {recursive: true});
        }

        if (!fs.existsSync(directoryViews)) {
            fs.mkdirSync(directoryViews, {recursive: true});
        }

        if (!fs.existsSync(directoryTypes)) {
            fs.mkdirSync(directoryTypes, {recursive: true});
        }

        const columnas = formatearCamposTable([...campos, 'Acciones']);
        const columnasJSON = JSON.stringify(columnas, null, 2);

        const camposFormCreate = formatoCamposFormCreate(campos);

        const modelPlurar = pluralizar(modeloMinusculas);

        const listTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'index.vue'), 'utf-8')
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ headers }}/g, columnasJSON)
            .replace(/{{ url }}/g, url)
            .replace(/{{ directory }}/g, directory.split('pages/')[1]);

        const inputsFormulario = formatoHtmlInputsFormulario(campos);

        const Viewfields = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Views', 'fields.vue'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ directory }}/g, directory.split('pages/')[1])
            .replace(/{{ inputsFormulario }}/g, inputsFormulario);

        const createTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'create.vue'), 'utf-8')
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ url }}/g, url)
            .replace(/{{ directory }}/g, directory.split('pages/')[1]);

        const camposInterfaz = formatoCamposInterfaz(campos);

        const interfazTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Types', 'index.ts'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ fieldsInterfaz }}/g, camposInterfaz);

        const editTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'edit.vue'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ url }}/g, url)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ directory }}/g, directory.split('pages/')[1]);

        const camposFormShow = formatoShowInputs(campos);

        const showTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'show.vue'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ fields }}/g, columnasJSON)
            .replace(/{{ directory }}/g, directory.split('pages/')[1])
            .replace(/{{ url }}/g, url)
            .replace(/{{ camposForm }}/g, camposFormShow);


        fs.writeFileSync(path.join(directory, 'index.vue'), listTemplate);

        fs.writeFileSync(path.join(directory, 'create.vue'), createTemplate);

        fs.writeFileSync(path.join(directoryViews, 'fields.vue'), Viewfields);

        fs.writeFileSync(path.join(directoryTypes, 'index.ts'), interfazTemplate);

        const editDir = path.join(directory, 'edit');
        if (!fs.existsSync(editDir)) {
            fs.mkdirSync(editDir, {recursive: true});
        }
        fs.writeFileSync(path.join(editDir, '[id].vue'), editTemplate);


        const showDir = path.join(directory, 'show');
        if (!fs.existsSync(showDir)) {
            fs.mkdirSync(showDir, {recursive: true});
        }
        fs.writeFileSync(path.join(showDir, '[id].vue'), showTemplate);

        console.log(`Archivos creados en ${directory}:`);
        console.log('- index.vue');
        console.log('- create.vue');
        console.log('- edit/[id].vue');
        console.log('- show/[id].vue');

    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        rl.close();
    }
};

function pluralizar(palabra) {
    if (!palabra) return "";

    const vocales = ['a', 'e', 'i', 'o', 'u'];
    const ultimaLetra = palabra.slice(-1).toLowerCase();
    const penultimaLetra = palabra.slice(-2, -1).toLowerCase();

    if (vocales.includes(ultimaLetra)) {
        return palabra + 's';
    } else if (ultimaLetra === 'z') {
        return palabra.slice(0, -1) + 'ces';
    } else if (ultimaLetra === 'n' || ultimaLetra === 'r') {
        return palabra + 'es';
    } else if (ultimaLetra === 'l' && penultimaLetra === 'e') {
        return palabra + 'es';
    } else {
        return palabra + 'es';
    }
}

askQuestions();


function formatearCampoLabel(str) {

    return str
        .split('_')
        .filter(word => word.toLowerCase() !== 'id')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

}


const tiposInputFormulario = (campos) => {
    let obj = Object.keys(campos);

    let tipoInput = [];


    obj.forEach(key => {
        tipoInput.push({
            label: formatearCampoLabel(campos[key]),
            type: "text",
            key: campos[key]
        });
    });

    return JSON.stringify(tipoInput, null, 2);
};


const formatoHtmlInputsFormulario = (campos) => {
    let obj = Object.keys(campos);

    let inputs = [];

    obj.forEach(key => {
        inputs.push(`
            <VCol cols="12" md="6">
                <VTextField
                    :id="useId()"
                    v-model="data.${campos[key]}"
                    :rules="[requiredValidator]"
                    label="${formatearCampoLabel(campos[key])}"
                    placeholder="Ingrese ${formatearCampoLabel(campos[key])}"
                    required
                />
            </VCol>
        `);
    });

    return inputs.join('');
};


const formatoCamposInterfaz = (campos) => {

    let obj = Object.keys(campos);

    let camposInterfaz = [];

    obj.forEach(key => {
        camposInterfaz.push(`
        ${campos[key]}: string;
        `);
    });

    return camposInterfaz.join('');
};

const formatoShowInputs = (campos) => {

    let obj = Object.keys(campos);

    let camposInterfaz = [];

    obj.forEach(key => {
        camposInterfaz.push(`
              <VListItemTitle>
                <h6 class="text-h6">
                    ${formatearCampoLabel(campos[key])}:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ item.${campos[key]} }}
                  </div>
                </h6>
              </VListItemTitle>
            `);
    });

    return camposInterfaz.join('');
};

const formatoCamposFormCreate = (campos) => {

    let state = {};

    campos.forEach(campo => {
        state[campo] = null;
    });

    const stateText = `{ ${Object.entries(state).map(([key, value]) => `${key}: ${value}`).join(',\n')} }`; // Agrega un salto de línea aquí

    return stateText;

};


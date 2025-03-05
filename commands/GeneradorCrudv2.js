import fs from 'fs'
import path from 'path'
import readline from 'readline'
import chalk from 'chalk'
import clipboardy from 'clipboardy';

const __dirname = path.resolve();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const formatoCamposFormCreate = (campos) => {

    let state = {};

    campos.forEach(campo => {
        state[campo] = null;
    });

    const stateText = `{ ${Object.entries(state).map(([key, value]) => `${key}: ${value}`).join(',\n')} }`;

    return stateText;

};

const formatearCamposTable = (campos) => {

    return campos.map(campo => {
        return {
            title: formatearCampoLabel(campo),
            value: campo,
        };
    });
};

const askQuestions = async () => {
    try {

        let datosBackend = clipboardy.readSync(); // Leer del portapapeles

        datosBackend = datosBackend.replace(/\u0000/g, "").trim();

        const datosJSON = JSON.parse(datosBackend);

        if( !datosJSON ) {

            throw new Error('El contenido del portapapeles no es un JSON válido');

        }

        const modelo = datosJSON.Modelo
        const url = datosJSON.Ruta
        const camposInput = Object.keys(datosJSON.columnas)

        const campos = camposInput.filter(campo => campo !== '');

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

        const listTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'index.txt'), 'utf-8')
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ headers }}/g, columnasJSON)
            .replace(/{{ url }}/g, url)
            .replace(/{{ directory }}/g, directory.split('pages/')[1]);

        const inputsFormulario = formatoHtmlInputsFormulario(campos);

        const Viewfields = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Views', 'fields.txt'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ directory }}/g, directory.split('pages/')[1])
            .replace(/{{ inputsFormulario }}/g, inputsFormulario);

        const createTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'create.txt'), 'utf-8')
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ url }}/g, url)
            .replace(/{{ directory }}/g, directory.split('pages/')[1]);

        const interfazTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Types', 'types.txt'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ fieldsInterfaz }}/g, JSON.stringify(datosJSON.columnas, null, 2));

        const editTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'edit.txt'), 'utf-8')
            .replace(/{{ model }}/g, modelo)
            .replace(/{{ modelPlural }}/g, modelPlurar)
            .replace(/{{ url }}/g, url)
            .replace(/{{ camposFormCreate }}/g, camposFormCreate)
            .replace(/{{ directory }}/g, directory.split('pages/')[1]);

        const camposFormShow = formatoShowInputs(campos);

        const showTemplate = fs.readFileSync(path.join(__dirname + '/PlantillasCrud/', 'Pages', 'show.txt'), 'utf-8')
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

        fs.writeFileSync(path.join(directoryTypes, 'types.ts'), interfazTemplate);

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

        console.log(chalk.greenBright('\n✅ Archivos generados correctamente:\n'))

        console.log(chalk.blue('📂 Páginas:'))
        console.log(chalk.cyanBright('  └── 📌 ' + directory))
        console.log(chalk.cyan('       ├── 📄 index.vue'))
        console.log(chalk.magentaBright('       ├── 📄 create.vue'))
        console.log(chalk.yellowBright('       ├── 📄 edit/[id].vue'))
        console.log(chalk.greenBright('       └── 📄️ show/[id].vue'))

        console.log(chalk.blue('📂 Interfaces:'))
        console.log(chalk.cyanBright('    └── 📌 ' + directoryTypes))
        console.log(chalk.cyan('        └── 📄 types.ts'))

        console.log(chalk.blue('📂 Vistas:'))
        console.log(chalk.cyanBright('    └── 📌 ' + directoryViews))
        console.log(chalk.cyan('        └── 📄 fields.vue'))

        console.log(chalk.greenBright('\n ¡Generación de CRUD completada!\n'))


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

function formatearCampoLabel(str) {

    return str
        .split('_')
        .filter(word => word.toLowerCase() !== 'id')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

}

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

askQuestions();

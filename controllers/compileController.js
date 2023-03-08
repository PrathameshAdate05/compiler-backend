const fs = require('fs');
const getInfo = require('../utils/getInfo');
const compileCode = require('../utils/compileCode');
const executeCode = require('../utils/executeCode');
const createFile = require('../utils/createFile');
const removeFiles = require('../utils/removeFiles');

const compile = async (req, res, next) => {
    const { code, language, input } = req.body;
    if (!code) {
        return res.status(400).json({
            success: false,
            message: 'Please provide the code to compile',
        });
    }
    if (!language) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a language',
        });
    }
    if (!['c', 'java', 'cpp', 'python'].includes(language)) {
        return res.status(400).json({
            success: false,
            message: 'Please select an appropriate language',
        });
    }

    const {
        filePath,
        outputPath,
        compileCommand,
        executeCommand,
        executeArgs,
        compileArgs,
    } = getInfo(language);

    await createFile(filePath, code);

    try {
        compileCommand && (await compileCode(compileCommand, compileArgs));
        output = await executeCode(executeCommand, executeArgs, input);
        await removeFiles(filePath, outputPath);
        res.status(200).json({
            success: true,
            output,
        });
    } catch (err) {
        await removeFiles(filePath, outputPath);
        return res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};

module.exports = compile;

const path = require('path')
const fs = require('fs')
const semver = require('semver')
const childProcess = require('child_process')

const electronInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../node_modules/electron/package.json')))

exports.version = childProcess.execSync('git describe --tags', { encoding:'utf-8' })
exports.version = exports.version.substring(1).trim()
exports.version = exports.version.replace('-', '-c')

if (exports.version.includes('-c')) {
    exports.version = semver.inc(exports.version, 'prepatch').replace('-0', `-nightly.${process.env.REV ?? 0}`)
}

exports.builtinPlugins = [
    'tabby-core',
    'tabby-settings',
    'tabby-terminal',
    'tabby-web',
    'tabby-community-color-schemes',
    'tabby-ssh',
    'tabby-serial',
    'tabby-telnet',
    'tabby-electron',
    'tabby-local',
    'tabby-plugin-manager',
    'tabby-linkifier',
]

exports.packagesWithDocs = [
    ['.', 'tabby-core'],
    ['terminal', 'tabby-terminal'],
    ['local', 'tabby-local'],
    ['settings', 'tabby-settings'],
]

exports.allPackages = [
    ...exports.builtinPlugins,
    'web',
    'tabby-web-demo',
]

exports.bundledModules = [
    '@angular',
    '@ng-bootstrap',
]
exports.electronVersion = electronInfo.version

exports.keygenConfig = {
    provider: 'keygen',
    account: 'a06315f2-1031-47c6-9181-e92a20ec815e',
    channel: 'stable',
    product: {
        win32: {
            x64: 'f481b9d6-d5da-4970-b926-f515373e986f',
            arm64: '950999b9-371c-419b-b291-938c5e4d364c',
        }[process.env.ARCH ?? process.arch],
        darwin: {
            arm64: '98fbadee-c707-4cd6-9d99-56683595a846',
            x86_64: 'f5a48841-d5b8-4b7b-aaa7-cf5bffd36461',
            x64: 'f5a48841-d5b8-4b7b-aaa7-cf5bffd36461',
        }[process.env.ARCH ?? process.arch],
        linux: {
            x64: '7bf45071-3031-4a26-9f2e-72604308313e',
            arm64: '39e3c736-d4d4-4fbf-a201-324b7bab0d17',
            armv7l: '50ae0a82-7f47-4fa4-b0a8-b0d575ce9409',
            armhf: '7df5aa12-04ab-4075-a0fe-93b0bbea9643',
        }[process.env.ARCH ?? process.arch],
    }[process.platform],
}

if (!exports.keygenConfig.product) {
    throw new Error(`Unrecognized platform ${process.platform}/${process.env.ARCH ?? process.arch}`)
}

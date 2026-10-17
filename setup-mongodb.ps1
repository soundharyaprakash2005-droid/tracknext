$ErrorActionPreference = 'Stop'

$secureUri = Read-Host 'Enter MongoDB Atlas URI (input is hidden)' -AsSecureString
if ($secureUri.Length -eq 0) {
    throw 'MongoDB URI cannot be empty.'
}

$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureUri)
try {
    $uri = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    $secureUri.Dispose()
}

try {
    $env:MONGODB_URI = $uri
    $env:MONGODB_DB_NAME = 'tracknext'

    node -e 'const { MongoClient } = require("mongodb"); const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 }); client.connect().then(() => client.db(process.env.MONGODB_DB_NAME).command({ ping: 1 })).then(() => console.log("MongoDB ping succeeded.")).catch((error) => { console.error(`MongoDB connection failed (${error.name}). Check the URI, database user, and Atlas IP access list.`); process.exitCode = 1; }).finally(() => client.close());'
    if ($LASTEXITCODE -ne 0) {
        throw 'MongoDB connection was not verified. The existing .env file was not changed.'
    }

    $escapedUri = $uri.Replace('\', '\\').Replace('"', '\"')
    Set-Content -Path (Join-Path $PSScriptRoot '.env') -Value @("MONGODB_URI=`"$escapedUri`"", 'MONGODB_DB_NAME=tracknext') -Encoding ascii
    Write-Output 'MongoDB URI saved to the Git-ignored .env file.'
}
finally {
    Remove-Item Env:MONGODB_URI -ErrorAction SilentlyContinue
    Remove-Item Env:MONGODB_DB_NAME -ErrorAction SilentlyContinue
    $uri = $null
}

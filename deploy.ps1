# Load environment variables from .env file if it exists
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $env:$($Matches[1]) = $Matches[2]
        }
    }
}

# Verify required environment variables
$requiredVars = @(
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
)

foreach ($var in $requiredVars) {
    if (-not (Get-Item env:$var -ErrorAction SilentlyContinue)) {
        Write-Error "Missing required environment variable: $var"
        exit 1
    }
}

# Deploy to Vercel
vercel deploy --prod --debug 
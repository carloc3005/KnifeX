# PowerShell script to fix knife image filenames
# Removes spaces and standardizes naming

$knifeFolder = "d:\KnifeX\KnifeX\src\assets\knives"

# Function to convert filename to consistent format
function Fix-KnifeName {
    param($fileName)
    
    # Remove spaces and convert to proper format
    $fixed = $fileName -replace '\s+', '-'
    
    # Fix specific typos
    $fixed = $fixed -replace 'Urban-Maked', 'Urban-Masked'
    $fixed = $fixed -replace 'blue-steel', 'Blue-Steel'
    $fixed = $fixed -replace 'Boreal-forest', 'Boreal-Forest'
    
    return $fixed
}

# Get all knife subfolders
$knifeFolders = Get-ChildItem -Path $knifeFolder -Directory

foreach ($folder in $knifeFolders) {
    Write-Host "Processing folder: $($folder.Name)" -ForegroundColor Yellow
    
    # Get all PNG files in the folder
    $pngFiles = Get-ChildItem -Path $folder.FullName -Filter "*.png"
    
    foreach ($file in $pngFiles) {
        $newName = Fix-KnifeName $file.Name
        
        if ($newName -ne $file.Name) {
            $newPath = Join-Path $folder.FullName $newName
            
            # Check if target file already exists
            if (Test-Path $newPath) {
                Write-Host "  WARNING: Target file already exists: $newName" -ForegroundColor Red
            } else {
                Write-Host "  Renaming: $($file.Name) -> $newName" -ForegroundColor Green
                Rename-Item -Path $file.FullName -NewName $newName
            }
        }
    }
}

Write-Host "File renaming complete!" -ForegroundColor Cyan

# Barcode Scanner Testing Script
# This script helps generate test tickets and manage the testing process

Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     ILORIN CAR SHOW 3.0 - BARCODE SCANNER TESTING SUITE             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_URL = "http://localhost:3000"
$TEST_RESULTS = @()

# Helper function to generate test ticket
function Generate-TestTicket {
    param(
        [string]$customerName,
        [string]$customerEmail,
        [string]$customerPhone,
        [string]$ticketType = "REGULAR",
        [string]$groupSize = "SINGLE",
        [int]$quantity = 1
    )
    
    Write-Host "Generating test ticket: $customerName ($ticketType)" -ForegroundColor Yellow
    
    $body = @{
        customerName  = $customerName
        customerEmail = $customerEmail
        customerPhone = $customerPhone
        ticketType    = $ticketType
        groupSize     = $groupSize
        quantity      = $quantity
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$API_URL/api/test/generate-ticket" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        $result = $response.Content | ConvertFrom-Json
        Write-Host "✅ Ticket generated successfully!" -ForegroundColor Green
        Write-Host "   Ticket Code: $($result.ticketCode)" -ForegroundColor Green
        Write-Host "   Ticket Type: $ticketType" -ForegroundColor Green
        Write-Host "   Group Size: $groupSize" -ForegroundColor Green
        Write-Host ""
        
        return $result
    }
    catch {
        Write-Host "❌ Error generating ticket: $_" -ForegroundColor Red
        return $null
    }
}

# Helper function to get all test tickets
function Get-TestTickets {
    Write-Host "Retrieving all test tickets..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$API_URL/api/test/generate-ticket" `
            -Method GET `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        $result = $response.Content | ConvertFrom-Json
        
        if ($result -and $result.Count -gt 0) {
            Write-Host "📋 Found $($result.Count) test tickets:" -ForegroundColor Green
            $result | ForEach-Object {
                Write-Host "   • $($_.ticketCode) - $($_.customerName)" -ForegroundColor Green
            }
        }
        else {
            Write-Host "No test tickets found" -ForegroundColor Yellow
        }
        Write-Host ""
        
        return $result
    }
    catch {
        Write-Host "❌ Error retrieving tickets: $_" -ForegroundColor Red
        return $null
    }
}

# Main Menu
function Show-Menu {
    Write-Host "🎯 SELECT AN OPTION:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣  Generate Single REGULAR Ticket" -ForegroundColor White
    Write-Host "2️⃣  Generate Single VIP Ticket" -ForegroundColor White
    Write-Host "3️⃣  Generate Multiple REGULAR Tickets" -ForegroundColor White
    Write-Host "4️⃣  Generate Test Bundle (REGULAR + VIP)" -ForegroundColor White
    Write-Host "5️⃣  View All Test Tickets" -ForegroundColor White
    Write-Host "6️⃣  Open Gate Testing Page" -ForegroundColor White
    Write-Host "7️⃣  Open Online Verification Page" -ForegroundColor White
    Write-Host "8️⃣  View Testing Documentation" -ForegroundColor White
    Write-Host "9️⃣  Exit" -ForegroundColor White
    Write-Host ""
    Write-Host "Enter your choice (1-9): " -ForegroundColor Cyan -NoNewline
}

# Main loop
$running = $true
while ($running) {
    Show-Menu
    $choice = Read-Host
    Write-Host ""
    
    switch ($choice) {
        "1" {
            $name = Read-Host "Enter customer name"
            $email = Read-Host "Enter email (or press Enter for default)"
            $phone = Read-Host "Enter phone (or press Enter for default)"
            
            if ([string]::IsNullOrWhiteSpace($email)) { $email = "test_$(Get-Random)@test.com" }
            if ([string]::IsNullOrWhiteSpace($phone)) { $phone = "08011111111" }
            
            Generate-TestTicket $name $email $phone "REGULAR" "SINGLE" 1
        }
        "2" {
            $name = Read-Host "Enter customer name"
            $email = Read-Host "Enter email (or press Enter for default)"
            $phone = Read-Host "Enter phone (or press Enter for default)"
            
            if ([string]::IsNullOrWhiteSpace($email)) { $email = "vip_$(Get-Random)@test.com" }
            if ([string]::IsNullOrWhiteSpace($phone)) { $phone = "08022222222" }
            
            Generate-TestTicket $name $email $phone "VIP" "GROUP_2" 1
        }
        "3" {
            $count = Read-Host "How many REGULAR tickets? (default: 3)"
            if ([string]::IsNullOrWhiteSpace($count)) { $count = 3 }
            
            for ($i = 1; $i -le $count; $i++) {
                $name = "Test User $i"
                $email = "testuser$i@test.com"
                $phone = "0801111111$i"
                Generate-TestTicket $name $email $phone "REGULAR" "SINGLE" 1
            }
        }
        "4" {
            Write-Host "Generating test bundle..." -ForegroundColor Yellow
            Write-Host ""
            
            # Regular tickets
            Generate-TestTicket "Regular Attendee 1" "regular1@test.com" "08011111111" "REGULAR" "SINGLE" 1
            Generate-TestTicket "Regular Attendee 2" "regular2@test.com" "08011111112" "REGULAR" "GROUP_2" 1
            
            # VIP tickets
            Generate-TestTicket "VIP Guest 1" "vip1@test.com" "08022222222" "VIP" "SINGLE" 1
            Generate-TestTicket "VIP Guest 2" "vip2@test.com" "08022222223" "VIP" "GROUP_4" 1
            
            Write-Host "✅ Test bundle created successfully!" -ForegroundColor Green
            Write-Host ""
        }
        "5" {
            Get-TestTickets
        }
        "6" {
            Write-Host "Opening Gate Testing Page..." -ForegroundColor Yellow
            Start-Process "$API_URL/gate"
            Write-Host "✅ Gate page opened in your browser!" -ForegroundColor Green
            Write-Host "   URL: $API_URL/gate" -ForegroundColor Green
            Write-Host ""
        }
        "7" {
            Write-Host "Opening Online Verification Page..." -ForegroundColor Yellow
            Start-Process "$API_URL/access"
            Write-Host "✅ Verification page opened in your browser!" -ForegroundColor Green
            Write-Host "   URL: $API_URL/access" -ForegroundColor Green
            Write-Host ""
        }
        "8" {
            Write-Host "📖 Available Documentation:" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "1. STEP_BY_STEP_BARCODE_TESTING.md" -ForegroundColor Yellow
            Write-Host "   └─ Complete step-by-step execution guide" -ForegroundColor Gray
            Write-Host ""
            Write-Host "2. BARCODE_SCANNER_TESTING_SETUP.md" -ForegroundColor Yellow
            Write-Host "   └─ Detailed testing guide with troubleshooting" -ForegroundColor Gray
            Write-Host ""
            Write-Host "3. QUICK_TEST_DATA_GENERATOR.md" -ForegroundColor Yellow
            Write-Host "   └─ How to create test tickets (API/Postman/Browser)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "4. QR_BARCODE_QUICK_REFERENCE.md" -ForegroundColor Yellow
            Write-Host "   └─ Quick reference card for troubleshooting" -ForegroundColor Gray
            Write-Host ""
            Write-Host "5. PHASE1_BARCODE_TESTING_READY.md" -ForegroundColor Yellow
            Write-Host "   └─ Overview of what's ready for testing" -ForegroundColor Gray
            Write-Host ""
        }
        "9" {
            Write-Host "Exiting..." -ForegroundColor Yellow
            $running = $false
        }
        default {
            Write-Host "❌ Invalid choice. Please select 1-9." -ForegroundColor Red
            Write-Host ""
        }
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Thank you for testing!                             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

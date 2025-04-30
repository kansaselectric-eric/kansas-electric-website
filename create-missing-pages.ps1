# PowerShell script to create missing pages for all submenu items
# This script reads the template-page.html file and creates pages for all submenu items

# Define the base directory
$baseDir = $PSScriptRoot

# Read the template file
$templatePath = Join-Path -Path $baseDir -ChildPath "template-page.html"
$templateContent = Get-Content -Path $templatePath -Raw

# Define the pages to create
# Format: [Page Path], [Page Title], [Page Description]
$pagesToCreate = @(
    # Services - Industrial Electrical Division
    @("services/industrial/wastewater-treatment/index.html", "Wastewater & Water Treatment Plants", "Kansas Electric provides electrical services for wastewater and water treatment plants."),
    @("services/industrial/oil-gas/index.html", "Oil, Gas & Carbon Capture Pipelines", "Kansas Electric provides electrical services for oil, gas, and carbon capture pipelines."),
    @("services/industrial/food-beverage/index.html", "Food & Beverage Manufacturing Plants", "Kansas Electric provides electrical services for food and beverage manufacturing plants."),
    @("services/industrial/advanced-manufacturing/index.html", "Advanced Manufacturing Facilities", "Kansas Electric provides electrical services for advanced manufacturing facilities."),
    @("services/industrial/microgrids/index.html", "Microgrids & Energy Management Systems", "Kansas Electric provides electrical services for microgrids and energy management systems."),
    
    # Services - Commercial Electrical Division
    @("services/commercial/large-scale/index.html", "Large-Scale Commercial Construction", "Kansas Electric provides electrical services for large-scale commercial construction projects."),
    @("services/commercial/water-towers/index.html", "Water Towers & Municipal Infrastructure", "Kansas Electric provides electrical services for water towers and municipal infrastructure."),
    @("services/commercial/airport/index.html", "Airport Electrical Infrastructure", "Kansas Electric provides electrical services for airport electrical infrastructure."),
    
    # Services - Service and Maintenance Division
    @("services/maintenance/ir-scans/index.html", "Infrared (IR) Scans & Predictive Maintenance", "Kansas Electric provides infrared scans and predictive maintenance services."),
    @("services/maintenance/arc-flash/index.html", "Arc Flash Studies & NFPA 70E Compliance", "Kansas Electric provides arc flash studies and NFPA 70E compliance services."),
    @("services/maintenance/nfpa-70b/index.html", "NFPA 70B & Electrical Maintenance Program Implementation", "Kansas Electric provides NFPA 70B and electrical maintenance program implementation services."),
    @("services/maintenance/breaker-testing/index.html", "Breaker Exercising & Power System Testing", "Kansas Electric provides breaker exercising and power system testing services."),
    @("services/maintenance/emergency/index.html", "24/7 Emergency Electrical Service", "Kansas Electric provides 24/7 emergency electrical services."),
    
    # Services - Automation and Control Systems Division
    @("services/automation/ul508a/index.html", "UL508A Panel Building & Fabrication", "Kansas Electric provides UL508A panel building and fabrication services."),
    @("services/automation/plc-programming/index.html", "PLC Programming & Industrial Automation", "Kansas Electric provides PLC programming and industrial automation services."),
    @("services/automation/troubleshooting/index.html", "Control Panel Troubleshooting & Upgrades", "Kansas Electric provides control panel troubleshooting and upgrades services."),
    @("services/automation/remote-monitoring/index.html", "Remote Monitoring & Smart Factory Solutions", "Kansas Electric provides remote monitoring and smart factory solutions."),
    
    # Projects - All Projects
    @("projects/stanley-black-decker/index.html", "Stanley Black & Decker - Network Upgrades", "Kansas Electric completed network upgrades for Stanley Black & Decker."),
    @("projects/mkc-lyons/index.html", "MKC - Lyons", "Kansas Electric completed electrical work for MKC in Lyons, KS."),
    @("projects/health-ministries/index.html", "Health Ministries Dental Clinic", "Kansas Electric completed electrical work for Health Ministries Dental Clinic."),
    @("projects/bethel-college/index.html", "Bethel College Solar Grid", "Kansas Electric completed the solar grid project for Bethel College."),
    @("projects/agco-hesston/index.html", "AGCO - Hesston", "Kansas Electric completed electrical work for AGCO in Hesston, KS."),
    @("projects/camso-control-panel/index.html", "Camso Control Panel", "Kansas Electric completed the control panel project for Camso."),
    
    # Projects - Industrial Projects
    @("projects/industrial/project1/index.html", "Industrial Project 1", "Kansas Electric industrial project."),
    @("projects/industrial/project2/index.html", "Industrial Project 2", "Kansas Electric industrial project."),
    @("projects/industrial/project3/index.html", "Industrial Project 3", "Kansas Electric industrial project."),
    @("projects/industrial/project4/index.html", "Industrial Project 4", "Kansas Electric industrial project."),
    @("projects/industrial/project5/index.html", "Industrial Project 5", "Kansas Electric industrial project."),
    
    # Projects - Commercial Projects
    @("projects/commercial/project1/index.html", "Commercial Project 1", "Kansas Electric commercial project."),
    @("projects/commercial/project2/index.html", "Commercial Project 2", "Kansas Electric commercial project."),
    @("projects/commercial/project3/index.html", "Commercial Project 3", "Kansas Electric commercial project."),
    @("projects/commercial/project4/index.html", "Commercial Project 4", "Kansas Electric commercial project."),
    @("projects/commercial/project5/index.html", "Commercial Project 5", "Kansas Electric commercial project."),
    
    # Projects - Service and Maintenance Projects
    @("projects/service/project1/index.html", "Service Project 1", "Kansas Electric service and maintenance project."),
    @("projects/service/project2/index.html", "Service Project 2", "Kansas Electric service and maintenance project."),
    @("projects/service/project3/index.html", "Service Project 3", "Kansas Electric service and maintenance project."),
    @("projects/service/project4/index.html", "Service Project 4", "Kansas Electric service and maintenance project."),
    @("projects/service/project5/index.html", "Service Project 5", "Kansas Electric service and maintenance project."),
    
    # Projects - Automation and Control Systems Projects
    @("projects/automation/project1/index.html", "Automation Project 1", "Kansas Electric automation and control systems project."),
    @("projects/automation/project2/index.html", "Automation Project 2", "Kansas Electric automation and control systems project."),
    @("projects/automation/project3/index.html", "Automation Project 3", "Kansas Electric automation and control systems project."),
    @("projects/automation/project4/index.html", "Automation Project 4", "Kansas Electric automation and control systems project."),
    @("projects/automation/project5/index.html", "Automation Project 5", "Kansas Electric automation and control systems project."),
    
    # About - Who We Are
    @("about/locations/index.html", "Locations", "Kansas Electric locations in Newton and Emporia, Kansas."),
    @("about/our-team/index.html", "Our Team", "Meet the Kansas Electric team."),
    
    # About - Company News
    @("company-news/index.html", "Company News", "Latest news and updates from Kansas Electric."),
    @("about/community/index.html", "Community Involvement", "Kansas Electric's community involvement and initiatives."),
    
    # Careers
    @("careers/administrative/position1/index.html", "Administrative Position 1", "Administrative career opportunity at Kansas Electric."),
    @("careers/administrative/position2/index.html", "Administrative Position 2", "Administrative career opportunity at Kansas Electric."),
    @("careers/project-management/position1/index.html", "Project Management Position 1", "Project management career opportunity at Kansas Electric."),
    @("careers/project-management/position2/index.html", "Project Management Position 2", "Project management career opportunity at Kansas Electric."),
    @("careers/electricians/position1/index.html", "Electrician Position 1", "Electrician career opportunity at Kansas Electric."),
    @("careers/electricians/position2/index.html", "Electrician Position 2", "Electrician career opportunity at Kansas Electric."),
    @("careers/engineering/position1/index.html", "Engineering Position 1", "Engineering career opportunity at Kansas Electric."),
    @("careers/engineering/position2/index.html", "Engineering Position 2", "Engineering career opportunity at Kansas Electric."),
    @("careers/estimating/position1/index.html", "Estimating Position 1", "Estimating career opportunity at Kansas Electric."),
    @("careers/estimating/position2/index.html", "Estimating Position 2", "Estimating career opportunity at Kansas Electric."),
    @("careers/apprenticeship/index.html", "Apprenticeship Program", "Kansas Electric's apprenticeship program."),
    @("careers/apprenticeship/position2/index.html", "Apprenticeship Position 2", "Apprenticeship opportunity at Kansas Electric."),
    
    # Contact
    @("contact/request-bid/index.html", "Request a Bid", "Request a bid for your electrical project from Kansas Electric.")
)

# Counter for created pages
$createdCount = 0
$skippedCount = 0

# Create each page
foreach ($page in $pagesToCreate) {
    $pagePath = Join-Path -Path $baseDir -ChildPath $page[0]
    $pageTitle = $page[1]
    $pageDescription = $page[2]
    
    # Create the directory if it doesn't exist
    $pageDir = Split-Path -Path $pagePath -Parent
    if (-not (Test-Path -Path $pageDir)) {
        New-Item -Path $pageDir -ItemType Directory -Force | Out-Null
        Write-Host "Created directory: $pageDir"
    }
    
    # Skip if the file already exists
    if (Test-Path -Path $pagePath) {
        Write-Host "Skipped existing file: $pagePath" -ForegroundColor Yellow
        $skippedCount++
        continue
    }
    
    # Calculate the relative path prefix based on directory depth
    $dirDepth = ($page[0].Split('/') | Where-Object { $_ -ne "" }).Count - 1
    $pathPrefix = "../" * $dirDepth
    
    # Replace the path prefix in the template
    $pageContent = $templateContent -replace '\./', $pathPrefix
    
    # Replace the title and description
    $pageContent = $pageContent -replace 'Page Title', $pageTitle
    $pageContent = $pageContent -replace 'Kansas Electric provides industrial and commercial electrical services, automation, and control systems.', $pageDescription
    
    # Write the file
    Set-Content -Path $pagePath -Value $pageContent
    Write-Host "Created page: $pagePath" -ForegroundColor Green
    $createdCount++
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Created $createdCount new pages" -ForegroundColor Green
Write-Host "Skipped $skippedCount existing pages" -ForegroundColor Yellow
Write-Host "`nAll pages have been created successfully!" -ForegroundColor Cyan
Write-Host "Run the update-navigation.bat file to update the navigation menu on all pages." -ForegroundColor Cyan 
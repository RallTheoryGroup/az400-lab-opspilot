targetScope = 'resourceGroup'

@allowed([
  'dev'
  'test'
])
param environmentName string = 'dev'

param location string = resourceGroup().location

var suffix = uniqueString(resourceGroup().id)
var appName = 'opspilot-${environmentName}-${suffix}'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'plan-${appName}'
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {
    reserved: true
  }
  tags: {
    application: 'OpsPilot'
    environment: environmentName
  }
}

resource app 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  kind: 'app,linux'
  tags: {
    application: 'OpsPilot'
    environment: environmentName
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|22-lts'
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
    }
  }
}

output appName string = app.name
output hostName string = app.properties.defaultHostName

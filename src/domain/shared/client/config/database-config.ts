

export interface DatabaseConfig {
  databaseName:() => string,
  host:() => string,
  port:() => number,
  user:() => string,
  password:() => string,
  maxConnections:() => number,
}
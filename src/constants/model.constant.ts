/* * Enumerates are ONLY allowed to modified by script, DO NOT MODIFY manually * */

enum PrismaModel {
  Project = 'project',
  Repository = 'repository',
  Artifact = 'artifact',
  Tag = 'tag',
  ServiceAccount = 'serviceAccount',
}

enum ModelName {
  Project = 'Project',
  Repository = 'Repository',
  Artifact = 'Artifact',
  Tag = 'Tag',
  ServiceAccount = 'ServiceAccount',
}

enum TableName {
  Project = 'project',
  Repository = 'repository',
  Artifact = 'artifact',
  Tag = 'tag',
  ServiceAccount = 'service_account',
}

enum StateEnum {
  Ready = 'READY',
  Deleted = 'DELETED',
  Error = 'ERROR',
  Creating = 'CREATING',
  Updating = 'UPDATING',
}

enum StatusEnum {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
  Offline = 'OFFLINE',
}

export { PrismaModel, ModelName, TableName, StateEnum, StatusEnum };

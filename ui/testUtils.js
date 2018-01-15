// These change a lot, remove them to prevent snapshot tests from constantly failing
export const sanitizeUser = user => {
  const _user = Object.assign({}, user)

  _user.username = 'test_username'
  delete _user.profile_image_url
  delete _user.created_at
  delete _user.updated_at

  return _user
}

export const sanitizeModel = model => {
  const _model = Object.assign({}, model)

  _model.name = 'test_model'
  delete _model.id
  delete _model.created_at
  delete _model.updated_at
  delete _model._abilities

  return _model
}

export const sanitizeDataset = dataset => {
  const _dataset = Object.assign({}, dataset)

  _dataset.name = 'test_dataset'
  delete _dataset.id
  delete _dataset.created_at
  delete _dataset.updated_at
  delete _dataset._abilities

  return _dataset
}

export const sanitizeBillingState = billingState => {
  const _billingState = billingState

  _billingState.abilities.cpu_predict.used = 1234
  _billingState.abilities.cpu_train.used = 0.1234
  _billingState.abilities.dataset_storage.used = 0.5
  _billingState.abilities.gpu_predict.used = 4321
  _billingState.abilities.gpu_train.used = 0.4321

  return _billingState
}

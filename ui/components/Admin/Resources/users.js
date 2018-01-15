import React from 'react'
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  BooleanInput,
  Create,
  EditButton,
  DeleteButton,
  Filter
} from 'admin-on-rest'

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label='Search' source='email' alwaysOn />
  </Filter>
)

export const UserList = props =>
  <List {...props} filters={<UserFilter />}>
    <Datagrid>
      <TextField source='id' />
      <TextField source='email' />
      <TextField source='name' />
      <TextField source='is_admin' />
      <DateField source='created_at' />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>

export const UserEdit = props =>
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source='id' />
      <TextInput source='email' />
      <TextInput source='name' />
      <BooleanInput label='Admin' source='is_admin' />
      <TextInput type='password' source='password' />
    </SimpleForm>
  </Edit>

export const UserChangePassword = props =>
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source='id' />
      <DisabledInput source='email' />
      <TextInput type='password' source='password' />
    </SimpleForm>
  </Edit>

export const UserCreate = props =>
  <Create {...props}>
    <SimpleForm>
      <DisabledInput source='id' />
      <TextInput source='email' />
      <TextInput source='name' />
      <BooleanInput label='Admin' source='is_admin' />
      <TextInput type='password' source='password' />
    </SimpleForm>
  </Create>

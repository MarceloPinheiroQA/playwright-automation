import { faker } from '@faker-js/faker';
import { CreateUserParams } from '../../models/general.api.model';

export const createUserFactory = (): CreateUserParams => {
  return {
    name: faker.person.fullName(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(), // Garante unicidade e evita case-sensitivity
    password: 'Password123!',
    title: 'Mr',
    birth_date: '21',
    birth_month: 'December',
    birth_year: '2001',
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: 'Apt 10',
    country: 'Canada',
    zipcode: 'M5V 3L9',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: faker.phone.number()
  };
};
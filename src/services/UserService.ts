import { faker } from "@faker-js/faker";
import { User } from "../types/User";

export const getUsers = (): Promise<User[]> => {
    let count = 0;

    const createRandomUser = (): User => {
        return {
            id: count++,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            city: faker.location.city(),
            registeredDate: faker.date.past(),
        };
    };

    // Mock api call with slight delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users: User[] = faker.helpers.multiple(createRandomUser, {
                count: 500,
            });
            resolve(users);
        }, 300);
    });
};

export const loginUser = () => {
    localStorage.setItem("loggedIn", "true");
};

export const logoutUser = () => {
    localStorage.setItem("loggedIn", "false");
};
export const saveUserColumns = (columns: string) => {
    localStorage.setItem("columns", columns);
};

USE employeeDB;

-- Seeding the departments table
INSERT INTO departments
    (id,department_name)
VALUES
    (NULL, "Engineering"),
    (NULL, "R&D"),
    (NULL, "Quality");

-- Seeding the roles table
INSERT INTO roles
    (id,title,salary,department_id)
VALUES
    (NULL, "Process Engineer", 50000, 1),
    (NULL, "Manufacturing Engineer", 65000, 1),
    (NULL, "Scientist", 40000, 1),
    (NULL, "Research Associate", 100000, 2),
    (NULL, "Quality Engineer", 75000, 2),
    (NULL, "Quality Technician", 45000, 2),
    (NULL, "Quality Manager", 80000, 3),
    (NULL, "Senior Technician", 60000, 3),
    (NULL, "R&D Intern", 1000, 3);

-- Seeding the employees table
INSERT INTO employees
    (id,first_name,last_name,role_id,manager_id)
VALUES
    (NULL, "Christian", "Ramirez", 1, NULL),
    (NULL, "Jalen", "Lewis", 2, NULL),
    (NULL, "Steven", "Schaab", 3, NULL),
    (NULL, "Vick", "Manjarrez", 4, NULL),
    (NULL, "Rafael", "Brill", 5, 4),
    (NULL, "Ana", "Reyes", 6, 4),
    (NULL, "Arnold", "Schwarzenegger", 7, NULL),
    (NULL, "Rocky", "Balboa", 8, 7),
    (NULL, "Ronie", "Coleman", 9, 7);
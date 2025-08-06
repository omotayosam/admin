////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Athlete data
export type Athlete = {
  athleteId: number;
  disciplineId: number;
  code: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  currentRank: number;
  created_at: string;
  updated_at: string;
};

// Mock athlete data store
export const fakeAthletes = {
  records: [] as Athlete[],

  // Initialize with sample data
  initialize() {
    const sampleAthletes: Athlete[] = [];
    function generateRandomAthleteData(athleteId: number): Athlete {
      const disciplines = [
        'Boxing',
        'Wrestling',
        'Football',
        'Basketball',
        'Athletics',

      ];

      return {
        athleteId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: faker.date.birthdate().toISOString(),
        disciplineId: faker.number.int({ min: 1, max: 5 }),
        currentRank: faker.number.int({ min: 1, max: 1000 }),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),

        updated_at: faker.date.recent().toISOString(),
        code: faker.number.int({ min: 1000, max: 9999 })
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleAthletes.push(generateRandomAthleteData(i));
    }

    this.records = sampleAthletes;
  },

  // Get all Athletes with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let athletes = [...this.records];

    // Filter athletes based on selected categories
    if (categories.length > 0) {
      athletes = athletes.filter((athlete) =>
        categories.includes(athlete.disciplineId.toString())
      );
    }

    // Search functionality across multiple fields
    if (search) {
      athletes = matchSorter(athletes, search, {
        keys: ['firstName', 'lastName', 'category']
      });
    }

    return athletes;
  },

  // Get paginated results with optional category filtering and search
  async getAthletes({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allAthletes = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalAthletes = allAthletes.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedAthletes = allAthletes.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_athletes: totalAthletes,
      offset,
      limit,
      athletes: paginatedAthletes
    };
  },

  // Get a specific athlete by its ID
  async getAthleteById(athleteId: number) {
    await delay(1000); // Simulate a delay

    // Find the athlete by its ID
    const athlete = this.records.find((athlete) => athlete.athleteId === athleteId);

    if (!athlete) {
      return {
        success: false,
        message: `Athlete with ID ${athleteId} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Athlete with ID ${athleteId} found`,
      athlete
    };
  }
};

// Initialize sample athletes
fakeAthletes.initialize();

// Product type definition
export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  photo_url: string;
};

// Mock products data store
export const fakeProducts = {
  records: [] as Product[],

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    const categories = [
      'Electronics',
      'Furniture',
      'Clothing',
      'Toys',
      'Groceries',
      'Books',
      'Jewelry',
      'Beauty Products'
    ];

    function generateRandomProductData(productId: number): Product {
      return {
        id: productId,
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: parseFloat(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        photo_url: faker.image.urlLoremFlickr({ category: 'product' })
      };
    }

    // Generate sample products
    for (let i = 1; i <= 50; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'category', 'description']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(productId: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === productId);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${productId} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${productId} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

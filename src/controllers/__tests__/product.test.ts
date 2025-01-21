import request from "supertest";
import server, {connectDB} from "../../server";
import db from '../../config/db';

describe('POST /api/products', () => {
    //validation errors
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.body.errors).not.toHaveLength(2)
        expect(response.status).not.toBe(404)
    })

    it('should validate that price is greater than 0', async () => {
        const body = {
            name: 'table - testing',
            price: -200
        }
        const response = await request(server).post('/api/products').send(body)

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        
        expect(response.body.errors).not.toHaveLength(2)
        expect(response.status).not.toBe(404)
    })

    it('should validate that price is a number and greater than 0', async () => {
        const body = {
            name: 'table - testing',
            price: 'hello'
        }
        const response = await request(server).post('/api/products').send(body)

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        
        expect(response.body.errors).not.toHaveLength(1)
        expect(response.status).not.toBe(404)
    })

    //validation ok
    it('should create a new product', async () => {
        const body = {
            name: "chair - testing",
            price: 200
          }
        const response = await request(server).post('/api/products').send(body)
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async() => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET to JSON response with products', async() => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.headers['content-type']).toMatch(/json/)
        
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Product not found')
    }) 

    it('should check a valid ID in the URL', async () => {
        const productId = 'hola';
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id must be a number')
    })

    it('should check if api/products/:id url exists', async() => {
        const productId = 1;
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).not.toBe(404)
    })

    it('GET to JSON response for a single product', async () => {
        const productId = 1;
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })    
})

describe('PUT /api/products/:id', () => {    
    it('should check a valid ID in the URL', async () => {
        const productId = 'hola';
        const body = {
            name: "chair testing - updated",
            price: 200,
            availability: true
          }
        const response = await request(server).put(`/api/products/${productId}`).send(body)
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id must be a number')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should display validation error messages when updating a product', async() => {
        const productId = 1;
        const response = await request(server).put(`/api/products/${productId}`).send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)
        
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

     it('should validate that price is greater than 0 ', async() => {
        const body = {
            name: "chair testing - updated",
            price: -200,
            availability: true
          }
        const productId = 1;
        const response = await request(server).put(`/api/products/${productId}`).send(body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Product price must be a positive number')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const body = {
            name: "chair testing - updated",
            price: 200,
            availability: true
        }
        const response = await request(server).put(`/api/products/${productId}`).send(body)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should update an existing product with valid data', async () => {
        const productId = 1;
        const body = {
            name: "chair testing - updated",
            price: 200,
            availability: false
        }
        const response = await request(server).put(`/api/products/${productId}`).send(body)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    }) 
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non existing product', async () => {
        const productId = 2000;      
        const response = await request(server).patch(`/api/products/${productId}`)
        
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should check a valid ID in the URL', async () => {
        const productId = 'hola';        
        const response = await request(server).patch(`/api/products/${productId}`)
        
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id must be a number')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const productId = 1;
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    }) 
})

describe('DELETE /api/products/:id', () => {
    it('should ckeck id param', async () => {
        const productID = 'hello'
        const response = await request(server).delete(`/api/products/${productID}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id must be a number')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return 404 if product does not exist', async () => {
        const productID = 2000;
        const response = await request(server).delete(`/api/products/${productID}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should delete an existing product with valid id', async () => {
        const productID = 1;
        const response = await request(server).delete(`/api/products/${productID}`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toBe('Product removed')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

//jest.mock('../../config/db')

// describe('connectDB', () => {
//     it('should handle database connection error', async () => {
//         jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Error to connect with data base'))
//         const consoleSpy = jest.spyOn(console, 'log')
//         await connectDB()
//         expect(consoleSpy).toHaveBeenCalledWith(
//             expect.stringContaining('Error to connect with data base')
//         )
//     })
// })


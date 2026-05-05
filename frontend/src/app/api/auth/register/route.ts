import { connect } from '@/lib/db'
import Teacher from '@/lib/models/Teacher'
import bcrypt from 'bcryptjs'

console.log("DB URI Check:", process.env.MONGODB_URI ? "LOADED" : "NOT LOADED");
console.log("Env:", process.env.MONGODB_URI);

export async function POST(req){
    await connect()
    
    try {
        const body = await req.json()
        const { username, email, password } = body

        // 1. Detailed Input Validation
        if (!username || !email || !password) {
            return new Response(JSON.stringify({ message: 'Missing username, email, or password.' }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // 2. Check for Existing User
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return new Response(JSON.stringify({ message: 'This email is already registered.' }), { 
                status: 409, // Conflict
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 3. Hash Password
        const hashed = await bcrypt.hash(password, 10)

        // 4. Create Teacher
        const newTeacher = await Teacher.create({ 
            username, 
            email, 
            password: hashed 
        });

        // 5. Success Response
        return new Response(JSON.stringify({ 
            id: newTeacher._id, 
            message: 'Registration successful.' 
        }), { 
            status: 201, 
            headers: { 'Content-Type': 'application/json' } 
        })
        
    } catch(err){ 
        console.error("Signup failed:", err);
        return new Response(JSON.stringify({ message: 'Internal server error during registration.' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }) 
    }
}
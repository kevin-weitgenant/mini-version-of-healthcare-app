import { db } from '../src/config/db';
import { doctorsTable } from '../src/db/schema';

// Hardcoded doctors data to seed
const doctorsData = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 49, // 4.9 * 10
    avatar: "https://static.vecteezy.com/system/resources/previews/035/899/632/large_2x/ai-generated-medical-hospital-doctor-image-by-ai-generator-free-photo.jpg"
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    rating: 48, // 4.8 * 10
    avatar: "https://png.pngtree.com/png-vector/20240524/ourmid/pngtree-male-young-doctor-cartoon-character-generated-by-ai-png-image_12450156.png"
  },
  {
    name: "Dr. Emily Williams",
    specialty: "Pediatrics",
    rating: 49, // 4.9 * 10
    avatar: "https://static.vecteezy.com/system/resources/previews/035/026/189/non_2x/ai-generated-portrait-of-a-female-doctor-standing-in-front-of-a-white-background-generative-ai-free-photo.jpg"
  },
  {
    name: "Dr. James Martinez",
    specialty: "Orthopedics",
    rating: 47, // 4.7 * 10
    avatar: "https://cdn.pixabay.com/photo/2023/07/14/23/57/ai-generated-8127875_1280.png"
  },
  {
    name: "Dr. Lisa Anderson",
    specialty: "Neurology",
    rating: 49, // 4.9 * 10
    avatar: "https://cdn.pixabay.com/photo/2023/02/24/04/29/ai-generated-7810166_960_720.jpg"
  },
  {
    name: "Dr. Robert Taylor",
    specialty: "General Practice",
    rating: 46, // 4.6 * 10
    avatar: "https://t4.ftcdn.net/jpg/05/94/46/77/360_F_594467718_8VcaoxOOfEimkY0BDrF7jZLwp0HmdVZH.jpg"
  },
  {
    name: "Dr. Amanda White",
    specialty: "Psychiatry",
    rating: 48, // 4.8 * 10
    avatar: "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827774.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    name: "Dr. David Brown",
    specialty: "Ophthalmology",
    rating: 47, // 4.7 * 10
    avatar: "https://t4.ftcdn.net/jpg/06/36/81/49/360_F_636814944_b9kQP3PKOE7VHEgc8ElpreRbPhgUAqNs.jpg"
  },
  {
    name: "Dr. Jessica Davis",
    specialty: "Endocrinology",
    rating: 49, // 4.9 * 10
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSqti6maRka_whIteI5AuuJKDFjoE5DZSXQ&s"
  },
  {
    name: "Dr. Christopher Lee",
    specialty: "Gastroenterology",
    rating: 48, // 4.8 * 10
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwvbYp9mbHscQJObJsh_QswQWbYXc_zh94Mw&s"
  }
];

async function seedDoctors() {
  try {
    console.log('🌱 Starting to seed doctors...');
    
    // Insert all doctors
    await db.insert(doctorsTable).values(doctorsData);
    
    console.log('✅ Successfully seeded', doctorsData.length, 'doctors!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();


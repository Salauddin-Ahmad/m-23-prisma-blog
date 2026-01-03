import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    // check user exist on db or not
    const adminData = {
      name: "Admins",
      email: "admin1@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
      emaiVerified: true
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User Already exists in db");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(adminData)
      }
    );
    console.log(signUpAdmin)

    if(signUpAdmin.ok){

    }
    
  } catch (error) {
    console.error(error);
  }
}

seedAdmin()




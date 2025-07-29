import { authClient } from "@/lib/auth-client"; //import the auth client

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export async function signUpUser(userData: SignUpData) {
  const { data, error } = await authClient.signUp.email({
    email: userData.email, 
    password: userData.password, 
    name: userData.name, 
    callbackURL: "/dashboard" // Direct redirect to dashboard after verification
  }, {
    onRequest: (ctx) => {
      console.log('Signup request initiated:', ctx);
    },
    onSuccess: (ctx) => {
      console.log('Signup successful, verification email sent:', ctx);
    },
    onError: (ctx) => {
      console.error('Signup error:', ctx.error);
    },
  });
  
  return { data, error };
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard"
  }, {
    onRequest: (ctx) => {
      //show loading
    },
    onSuccess: (ctx) => {
      //redirect to the dashboard or sign in page
    },
    onError: (ctx) => {
      // display the error message
      // alert(ctx.error.message);
    },
  });
  
  return { data, error };
}

export async function signInGithub(){
   const { data, error } = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard"
  }, {
    onRequest: (ctx) => {
      //show loading
    },
    onSuccess: (ctx) => {
      //redirect to the dashboard or sign in page
    },
    onError: (ctx) => {
      // display the error message
      // alert(ctx.error.message);
    },
  });
  
  return { data, error };
}

export async function signInGoogle(){
  const { data, error } = await authClient.signIn.social({
   provider: "google",
   callbackURL: "/dashboard"
 }, {
   onRequest: (ctx) => {
     //show loading
   },
   onSuccess: (ctx) => {
     //redirect to the dashboard or sign in page
   },
   onError: (ctx) => {
     // display the error message
    //  alert(ctx.error.message);
   },
 });
 
 return { data, error };
}

// Email verification function
export async function verifyEmail(token: string) {
  try {
    // This would typically call your backend API to verify the token
    // For now, we'll use the auth client's verify method if available
    // Replace this with your actual verification logic
    
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Verification failed' 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      data 
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred during verification' 
    };
  }
}

// Resend verification email function
export async function resendVerificationEmail(email: string) {
  try {
    const response = await fetch('/api/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Failed to resend verification email' 
      };
    }

    return { 
      success: true, 
      message: 'Verification email sent successfully' 
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred while resending verification email' 
    };
  }
}
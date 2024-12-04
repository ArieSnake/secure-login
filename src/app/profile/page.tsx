import { redirect } from "next/navigation";
import { verifyUser } from "../_lib/actions";

export default async function Profile() {
    let user = await verifyUser()


    if(!user) {
        return redirect('/login')
    }
    
    return (
        <div className="flex flex-col items-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-10 rounded-xl shadow-xl max-w-sm mx-auto border border-gray-700">
            <img
                src="https://i.scdn.co/image/ab67616d0000b273d07e5d8e3dfabfc59b6f8991"
                
                className="w-36 h-36 rounded-full border-4 border-purple-500 shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-3xl font-extrabold text-purple-400 mt-6 mb-2">
                Alita Battle Angel
            </h1>
            <p className="text-sm text-gray-400 italic text-center">
                “I do not stand by in the presence of evil.”
            </p>
            <div className="mt-4 flex space-x-4">
                <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all duration-300">
                    Follow
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white shadow-md transition-all duration-300">
                    Message
                </button>
            </div>
        </div>
    );
}


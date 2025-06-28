"use server";

export const getServerStatus = async () => {
try {
    const response = await fetch("http://localhost:3000/");
    console.log("response from server: ", response);
    
    if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
    }
    const serverStatus = await response.json();
    return serverStatus.status
} catch (error) {
    console.error("Failed to fetch server status:", error);
    throw error;
}
};

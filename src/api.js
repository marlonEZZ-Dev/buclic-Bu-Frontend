import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Inicializamos una instancia de Axios
const api = axios.create({
    headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
    },
});

// Cargar env.json y configurar baseURL dinámicamente
export const loadConfig = async () => {
    try {
        // Hacemos fetch de env.json
        const response = await fetch("/env.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo env.json");
        }
        const config = await response.json();

        // Configuramos baseURL
        api.defaults.baseURL = config.API;
        console.log("BaseURL configurada como:", config.API);
    } catch (error) {
        console.error("Error cargando env.json:", error);
        throw new Error("Failed to load API configuration");
    }
};
// Llamamos a loadConfig inmediatamente para inicializar 

// Configurar interceptores de Axios
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
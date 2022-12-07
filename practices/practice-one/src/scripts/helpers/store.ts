export default (key: string) => {
    return {
        get() {
            return localStorage.getItem(key);
        },
        save<T>(value: T) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            }
            catch (error) {
                throw "Can't add to localStorage";
            }
        },
    };
};


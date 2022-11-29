const store = (key: string) => {
    return {
        get() {
            return localStorage.getItem(key);
        },
        save(value: any) {
            localStorage.setItem(key, JSON.stringify(value));
        },
    };
};

export default store;

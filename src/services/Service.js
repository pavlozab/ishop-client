
import { axiosInstance } from "./interceptor";
class Service{
    

    getAllProducts = async ({ limit = '', filters = {}, sort, search = '', discountParam}) => {
        let filter = '';
        let sortBy, order;
        if(sort){
            sortBy = `sortBy=${sort.split(' ')[0]}&`
            order = sort.split(' ')[1]
        }else{
            sortBy = '';
            order='ASC';
        }
        search = search ? `&Search=${search}` : ''
        for (const key in filters) {
            if (Object.hasOwnProperty.call(filters, key)) {
                if(filters[key].length===0) continue
                filter+=`${key}='${filters[key].join("','")}'&`
            }
        }
        
        const res = await axiosInstance.get(`/product${discountParam ? '/discount': ''}?${filter}Limit=${limit}&${sortBy}&sortType=${order}${search}&${discountParam ? `discount=${discountParam}`: ''}`);
        return res.data.result.items;
    }

    getProduct = async (id) => {
        const res = await axiosInstance.get(`/product/${id}`);
        return res.data.result;
    }

    updateProd = async (prod, id) =>  await axiosInstance.put(`/product/${id}`, prod)
    postOrder = async (order) => await axiosInstance.post('/orders', order)
    getOrders = async () => await axiosInstance.get('/orders');
    getColors = async () => await axiosInstance.get('/product/colors');
    getDiagonals = async () => await axiosInstance.get('/product/diagonals');
    getMemories = async () => await axiosInstance.get('/product/memories');
    signUp = async (newUser) => await axiosInstance.post('auth/registration', newUser);
    signIn = async (loggedUser) => await axiosInstance.post('auth/login', loggedUser)

    postProduct = async (prod) => {
        return await axiosInstance.post('/product', this._transformForPost(prod))
    }

    _transformForPost = (prod) => {
        for (const key in prod) {
            if (Object.hasOwnProperty.call(prod, key)) {
                const element = prod[key];
                if(!isNaN(element) && (key!=='amount' || key!=='memory')) prod[key] = parseFloat(prod[key])
            }
        }
        if(!prod['newPrice']) prod['newPrice'] = 0;
        prod['amount'] = parseFloat(prod['amount']);
        prod['memory'] = parseFloat(prod['memory']);
        return prod;
    }
}

export default Service;
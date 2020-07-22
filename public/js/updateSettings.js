import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (name, email) => {
    try{
        const res = await axios({
            method: 'patch',
            url: 'http://127.0.0.1:3000/api/v1/users/updateMe', 
            data: {
                name,
                email
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Data updated');
        }

    }catch(err){
        showAlert('error');
    }
}
module.exports = function logout() {
   this.setState({
      isLoading: true
   });

   const obj = getFromStorage('the_main_app');

   if (obj && obj.token)
   {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
         .then(res => res.json())
         .then(json => {
            if (json.success)
            {
               this.setState({
                  token: '',
                  isLoading: false
               });
            }
            else
            {
               this.setState({
                  isLoading: false
               });
            }
         });
   }
   else
   {
      this.setState({
         isLoading: false
      });
   }
};

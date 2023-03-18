const Home = Vue.component("home", {
    template : `
                <div>
                        <h2> Home Page </h2>
                        <p>Number of Products : {{this.$store.state.count}}</p>
                        <p>Total Amount : {{this.$store.state.cost}}</p>
                        This is my home page !!      
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid sed placeat vero, sit corporis fugiat rerum mollitia reiciendis dicta pariatur id architecto harum esse totam odio deserunt illum modi doloribus nobis velit magni repellendus at consequatur quasi. Illum quia rem atque eos itaque eius! Deleniti animi fuga inventore ut modi.
                </div>
    `
})

export default Home;
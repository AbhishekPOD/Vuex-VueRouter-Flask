const Course = Vue.component("course", {
    props : ['id'],
    template : `
                <div>
                        <h2> Course </h2>
                        This is the course page for {{this.id}} !!      
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid sed placeat vero, sit corporis fugiat rerum mollitia reiciendis dicta pariatur id architecto harum esse totam odio deserunt illum modi doloribus nobis velit magni repellendus at consequatur quasi. Illum quia rem atque eos itaque eius! Deleniti animi fuga inventore ut modi.
                </div>
    `
})

export default Course;
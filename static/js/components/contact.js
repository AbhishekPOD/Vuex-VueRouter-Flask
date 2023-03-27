const ContactUs = Vue.component("contact-us", {
  template: `
                <div>
                        <h2> Contact Us </h2>
                        Below are our contact details !!      
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid sed placeat vero, sit corporis fugiat rerum mollitia reiciendis dicta pariatur id architecto harum esse totam odio deserunt illum modi doloribus nobis velit magni repellendus at consequatur quasi. Illum quia rem atque eos itaque eius! Deleniti animi fuga inventore ut modi.
                </div>
    `,

  mounted: function () {
    document.title = "Blogs - Contact Us";
  },
});

export default ContactUs;

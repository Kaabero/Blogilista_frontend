describe('Blog app', function() {
    beforeEach(function() {
        
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
          name: 'Test User',
          username: 'testuser',
          password: 'testpassword'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user) 
        cy.visit('http://localhost:5173')
    })
  
    it('Login form is shown', function() {
      cy.contains('log in to application')
    })

    
    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('testuser')
            cy.get('#password').type('testpassword')
            cy.get('#login-button').click()

            cy.contains('Test User logged in')
          
        })
        
        it('fails with wrong credentials', function() {
            
            cy.get('#username').type('wrongusername')
            cy.get('#password').type('testpassword')
            cy.get('#login-button').click()
        
            cy.contains('wrong username or password')
        })
          
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.get('#username').type('testuser')
            cy.get('#password').type('testpassword')
            cy.get('#login-button').click()
           
        })
      
        it('A blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('Test Blogger')
            cy.get('#url').type('www.test.fi')
            cy.get('#create-button').click()
            cy.contains('a blog created by cypress')
        })
  
           
    })
})
      
     
        
    
      

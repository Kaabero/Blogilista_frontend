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
  })
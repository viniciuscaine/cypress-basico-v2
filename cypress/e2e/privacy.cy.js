Cypress._.times(5, function () {
    it('testa a página da política de privacidade de forma independente', () => {
        cy.visit('src/privacy.html')
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
        cy.contains('Talking About Testing').should('be.visible')
    })
})


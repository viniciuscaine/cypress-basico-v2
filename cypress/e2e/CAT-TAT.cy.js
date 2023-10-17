/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {

    beforeEach(() => {
        cy.visit('src/index.html')
    })

    it('verifica o título da aplicação', () => {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Vinícius')
        cy.get('#lastName').type('Cainé')
        cy.get('#email').type('vinicius@email.com')
        cy.get('#open-text-area').type('Texto teste Texto teste Texto teste Texto teste Texto teste', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.clock()
        cy.get('#firstName').type('Vinícius')
        cy.get('#lastName').type('Cainé')
        cy.get('#email').type('vinicius@emailcom')
        cy.get('#open-text-area').type('Texto teste Texto teste Texto teste Texto teste Texto teste', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    Cypress._.times(5, function () {
        it('campo de telefone continua vazio se números não forem digitados', () => {
            cy.get('#phone').type('abcabc').should('have.value', '')
        })
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Vinícius')
        cy.get('#lastName').type('Cainé')
        cy.get('#email').type('vinicius@emailcom')
        cy.get('#open-text-area').type('Texto teste Texto teste Texto teste Texto teste Texto teste', { delay: 0 })
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('.phone-label-span').should('have.text', ' (obrigatório)')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Vinícius').should('have.value', 'Vinícius').clear().should('have.value', '')
        cy.get('#lastName').type('Cainé').should('have.value', 'Cainé').clear().should('have.value', '')
        cy.get('#email').type('vinicius@email.com').should('have.value', 'vinicius@email.com').clear().should('have.value', '')
        cy.get('#open-text-area').type('Texto teste').should('have.value', 'Texto teste').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit('Vinicius', 'Lima', 'vinicius@gmail.com', 'Texto teste')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value=feedback]').check().should('be.checked').should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"][value=feedback]').check().should('be.checked').should('have.value', 'feedback')
        cy.get('input[type="radio"][value=ajuda]').check().should('be.checked').should('have.value', 'ajuda')
        cy.get('input[type="radio"][value=elogio]').check().should('be.checked').should('have.value', 'elogio')

        cy.get('input[type="radio"]').should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('#check input[type="checkbox"]').check().should('be.checked')
            .last().uncheck().should('not.be.checked')
    })

    it('eleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
            .should('have.value', 'C:\\fakepath\\example.json')
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload').selectFile('cypress/fixtures/example_copy.json', { action: 'drag-drop' })
            .should('have.value', 'C:\\fakepath\\example_copy.json')
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example_copy_2.json').as('sampleFile')
        cy.get('#file-upload').selectFile('@sampleFile')
            .should('have.value', 'C:\\fakepath\\example_copy_2.json')
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a')
            .should('have.attr', 'target', '_blank')
            .should('have.attr', 'href', 'privacy.html')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a').invoke('removeAttr', 'target').click()
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success').should('not.be.visible')
            .invoke('show').should('be.visible').and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide').should('not.be.visible')

        cy.get('.error').should('not.be.visible')
            .invoke('show').should('be.visible').and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide').should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('faz uma requisição HTTP', () => {
        cy.request({
            method: 'GET',
            url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.statusText).to.equal('OK')
            expect(response.body).to.have.string('CAC TAT')
        })
    })
})

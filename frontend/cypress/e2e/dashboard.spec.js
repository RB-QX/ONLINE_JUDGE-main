// cypress/e2e/dashboard.spec.js
describe('Dashboard recommendations flow', () => {
    before(() => {
      // seed database for dev, if you have a script
      // cy.exec('npm run seed:dev');
    });
  
    it('shows and consumes recommendations', () => {
      cy.fixture('login-data').then(({ users }) => {
        const user = users[0];
        cy.login(user.username, user.password);                     // using custom command :contentReference[oaicite:3]{index=3}
      });
  
      cy.url().should('include', '/dashboard');                      // land on Dashboard :contentReference[oaicite:4]{index=4}
  
      // should see at least one recommended problem
      cy.contains('Recommended Problems').should('be.visible');
      cy.get('a').contains('Graph DP').should('exist');
  
      // click it to simulate solve
      cy.get('a').contains('Graph DP').click();
      // wait for refetch
      cy.wait(500);
  
      // back on dashboard, item gone
      cy.visit('/dashboard');
      cy.get('a').contains('Graph DP').should('not.exist');
    });
  });
  
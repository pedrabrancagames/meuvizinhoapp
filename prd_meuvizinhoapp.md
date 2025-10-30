# PRD - MeuVizinhoApp
**Aplicativo de Empréstimo de Objetos e Eventos Comunitários**

---

## 1. Visão Geral do Produto

### 1.1 Resumo Executivo
MuVizinhoApp é uma plataforma mobile-first que conecta vizinhos para empréstimo de objetos do dia a dia e divulgação de eventos comunitários. Inspirado no conceito "tem açúcar?", o app facilita a economia colaborativa local, fortalece laços comunitários e promove sustentabilidade através do compartilhamento de recursos.

### 1.2 Objetivos do Produto
- Facilitar empréstimos de objetos entre vizinhos de forma segura e rastreável
- Criar um canal de comunicação para eventos e iniciativas da comunidade
- Construir reputação dos usuários através de um sistema de avaliações
- Reduzir desperdício incentivando o compartilhamento ao invés da compra
- Fortalecer o senso de comunidade local

### 1.3 Público-Alvo
- **Primário**: Moradores de bairros urbanos, 25-50 anos, que valorizam economia colaborativa
- **Secundário**: Síndicos e administradores de condomínios, líderes comunitários
- **Terciário**: Novos moradores buscando integração na comunidade

---

## 2. Funcionalidades Core

### 2.1 Sistema de Autenticação
**Prioridade**: P0 (Crítica)

#### Cadastro
- Login via Google/Email (Firebase Authentication)
- Campos obrigatórios:
  - Nome completo
  - Foto de perfil
  - Endereço (rua e número)
  - Telefone

#### Verificação de Telefone via SMS
**⚠️ ATENÇÃO**: Devido aos custos de SMS no Firebase, implementar estratégia otimizada:

**Estratégia de Verificação**:
1. **Fase MVP**: Verificação via Email Link (gratuito)
   - Usar Firebase Email Link Authentication
   - Enviar código de 6 dígitos por email
   - Telefone coletado mas não verificado inicialmente
   - Exibir badge "Telefone não verificado" no perfil

2. **Fase Pós-MVP** (quando houver budget ou sponsorship):
   - Implementar SMS opcional para usuários premium
   - Ou: Usar serviço brasileiro mais barato (Twilio Brasil, Zenvia)
   - Ou: Implementar chamada de voz com código gravado (mais barato)

**Custos de SMS (Referência)**:
- **Firebase Phone Auth**: 
  - Requer plano Blaze (pago)
  - 10 SMS gratuitos/dia para testes
  - Custo: ~$0.01-0.06 por SMS (varia por país)
  - Para 100 cadastros/dia = ~$60-180/mês 💰

- **WhatsApp Business API**: 
  - NÃO É VIÁVEL para verificação de cadastro
  - Requer BSP (Business Solution Provider) pago
  - Processo de aprovação complexo
  - Custo por mensagem de autenticação
  - Melhor para notificações pós-cadastro

**Alternativas Gratuitas Recomendadas**:
✅ Email Link Authentication (Firebase - gratuito)
✅ Verificação social (confiança no Google OAuth)
✅ Verificação por geolocalização (confirmar que está no bairro)
✅ Sistema de convites (código compartilhado por vizinhos verificados)

#### Implementação Inicial (MVP)
```javascript
// Usar Firebase Email Link Authentication
const actionCodeSettings = {
  url: 'https://meuvizinhoapp.app/finishSignUp',
  handleCodeInApp: true,
};

await sendSignInLinkToEmail(auth, email, actionCodeSettings);
```

#### Segurança sem Verificação SMS
- Limite de 3 pedidos por usuário não-verificado
- Pedidos de não-verificados têm badge visível
- Usuários verificados (por email) podem denunciar suspeitos
- Sistema de karma: usuários com transações bem-sucedidas ganham confiança
- Validação de proximidade (raio máximo de 3km para empréstimos)

### 2.2 Feed de Pedidos (Home)
**Prioridade**: P0 (Crítica)

#### Visualização
- Lista de pedidos ordenados por proximidade e data
- Card de pedido contém:
  - Foto do solicitante
  - Badge de verificação (se aplicável)
  - Nome do item solicitado (destaque)
  - Descrição breve
  - Distância do usuário
  - Data/hora da publicação
  - Foto ilustrativa (opcional)
  
#### Ações
- **Ajudar**: Oferece o item ao solicitante
- **Não Posso**: Remove o pedido do feed temporariamente
- **Denunciar**: Reporta conteúdo inadequado

#### Filtros
- Por categoria (ferramentas, cozinha, eletrônicos, etc.)
- Por distância (100m, 500m, 1km, 3km)
- Por status (aberto, em andamento, concluído)
- **Novo**: Apenas usuários verificados (checkbox)

### 2.3 Criar Pedido
**Prioridade**: P0 (Crítica)

#### Formulário
- Nome do item (obrigatório, máx. 50 caracteres)
- Categoria (dropdown)
- Descrição detalhada (obrigatório, máx. 500 caracteres)
- Foto do item similar (opcional)
- Prazo necessário (data início/fim)
- Urgência (normal, urgente)

#### Validações
- Limite de 3 pedidos ativos para usuários não-verificados
- Limite de 5 pedidos ativos para usuários verificados
- Cooldown de 1 hora entre pedidos similares
- Moderação automática de palavras proibidas

### 2.4 Sistema de Chat
**Prioridade**: P0 (Crítica)

#### Funcionalidades
- Chat individual entre solicitante e ofertante
- Mensagens de texto em tempo real (Firebase Realtime DB)
- Indicador de "digitando..."
- Notificações push de novas mensagens (FCM - gratuito)
- Histórico permanente de conversas

#### Ações Rápidas no Chat
- Compartilhar localização
- Compartilhar telefone (opcional, com consentimento)
- Confirmar recebimento do item
- Avaliar transação
- Denunciar usuário

### 2.5 Perfil do Usuário
**Prioridade**: P0 (Crítica)

#### Informações Públicas
- Foto e nome
- Badge de verificação:
  - ✅ Email verificado (verde)
  - 📧 Apenas email (cinza)
  - ⭐ Telefone verificado (dourado - futuro)
- Avaliação média (estrelas de 1-5)
- Badges de conquistas:
  - "Bom Vizinho" (10+ empréstimos)
  - "Sempre Disponível" (resposta < 1h)
  - "Confiável" (100% devoluções no prazo)
  
#### Estatísticas
- Pedidos feitos
- Empréstimos realizados
- Taxa de devolução
- Tempo médio de resposta
- Membro desde (data)

#### Configurações
- Editar perfil
- Editar endereço
- **Verificar telefone** (via SMS - futuro, pago)
- Notificações
- Privacidade
- Raio de busca
- Modo escuro

### 2.6 Sistema de Reputação
**Prioridade**: P1 (Alta)

#### Avaliação de Transação
Após devolução do item:
- Avaliação de 1-5 estrelas
- Campos específicos:
  - Comunicação
  - Cuidado com o item
  - Pontualidade
- Comentário opcional (máx. 200 caracteres)

#### Penalidades
- Não devolver item: -50 pontos de reputação + suspensão temporária
- Devolver danificado: -30 pontos
- Atraso > 2 dias: -10 pontos
- Suspensão automática abaixo de 2.0 estrelas
- Denúncias acumuladas: investigação manual

### 2.7 Notificações
**Prioridade**: P1 (Alta)

#### Tipos (via Firebase Cloud Messaging - GRATUITO)
- Alguém ofereceu ajuda no seu pedido
- Nova mensagem no chat
- Lembrete de devolução (1 dia antes)
- Item não devolvido (alerta)
- Nova avaliação recebida
- Evento próximo criado
- Conquista desbloqueada

### 2.8 Feed de Eventos Comunitários
**Prioridade**: P2 (Média)

#### Criar Evento
- Título do evento
- Descrição
- Data e horário
- Local (endereço ou "na comunidade")
- Categoria (reunião, festa, bazaar, etc.)
- Foto de capa

#### Visualização
- Lista cronológica de eventos
- Filtro por data e categoria
- "Tenho Interesse" (contador de interessados)
- Compartilhamento externo

---

## 3. Arquitetura Técnica

### 3.1 Stack Tecnológico

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Estado**: React Context API / Zustand
- **Mobile**: PWA com manifest e service workers

#### Backend
- **Hospedagem**: Vercel (plano gratuito)
- **API**: Next.js API Routes / Server Actions
- **Database**: Vercel Postgres (plano gratuito)
  - Alternativa: Firebase Firestore
  
#### Autenticação
- **Serviço**: Firebase Authentication
- **Métodos**: 
  - ✅ Google OAuth (gratuito, ilimitado)
  - ✅ Email/Password (gratuito, ilimitado)
  - ✅ Email Link (gratuito, ilimitado)
  - ❌ Phone Auth (pago - apenas fase futura)

#### Storage
- **Imagens**: Vercel Blob Storage (plano gratuito, 1GB)
  - Alternativa: Firebase Storage (5GB gratuitos)

#### Real-time & Notificações
- **Chat**: Firebase Realtime Database (gratuito até limites)
- **Notificações Push**: Firebase Cloud Messaging (FCM - GRATUITO, ilimitado)

### 3.2 Modelo de Dados

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  photo_url TEXT,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  address_street VARCHAR(255),
  address_number VARCHAR(10),
  address_neighborhood VARCHAR(100),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  reputation_score DECIMAL(3, 2) DEFAULT 5.0,
  karma_points INTEGER DEFAULT 0,
  total_requests INTEGER DEFAULT 0,
  total_loans INTEGER DEFAULT 0,
  verification_method VARCHAR(20) DEFAULT 'email',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP
);
```

#### Requests (Pedidos)
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  photo_url TEXT,
  urgency VARCHAR(20) DEFAULT 'normal',
  needed_from DATE,
  needed_until DATE,
  status VARCHAR(20) DEFAULT 'open',
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);
```

#### Offers (Ofertas de Ajuda)
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES requests(id),
  lender_id UUID REFERENCES users(id),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Transactions (Empréstimos)
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES requests(id),
  borrower_id UUID REFERENCES users(id),
  lender_id UUID REFERENCES users(id),
  item_name VARCHAR(100),
  borrowed_at TIMESTAMP,
  expected_return_at TIMESTAMP,
  returned_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Reviews (Avaliações)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  reviewer_id UUID REFERENCES users(id),
  reviewed_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  communication_rating INTEGER,
  care_rating INTEGER,
  punctuality_rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Events (Eventos)
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  photo_url TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  interested_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Invite_Codes (Sistema de Convites - Alternativa à Verificação SMS)
```sql
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  inviter_id UUID REFERENCES users(id),
  invitee_email VARCHAR(255),
  used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

### 3.3 Limites do Plano Gratuito e Estratégias

#### Vercel (Gratuito)
- ✅ 100GB bandwidth/mês
- ✅ 6.000 minutos de build/mês
- ✅ Serverless Function: 10s timeout
- ✅ Postgres: 256MB storage, 60h compute/mês

#### Firebase (Spark Plan - Gratuito)
- ✅ Authentication: ilimitado (exceto Phone Auth)
- ✅ Firestore: 1GB storage, 50k reads/day, 20k writes/day
- ✅ Storage: 5GB, 1GB download/day
- ✅ Cloud Messaging (FCM): ilimitado e gratuito
- ✅ Realtime Database: 1GB storage, 10GB/mês de download
- ❌ Phone Authentication: NÃO disponível no plano gratuito

**Estratégias de Otimização:**
- Cache agressivo de imagens (CDN)
- Paginação de feeds (20 items por vez)
- Lazy loading de conversas
- Compressão de imagens antes do upload (client-side)
- Cleanup automático de dados antigos (>1 ano)
- Usar Email Link Auth ao invés de SMS

---

## 4. Design e UX

### 4.1 Paleta de Cores
- **Primary**: `#FF888E` (coral suave) - Ações principais, botões de ajuda
- **Secondary**: `#5FAFBD` (azul-turquesa) - Elementos secundários
- **Accent**: `#19cc61` (verde) - Confirmações, sucesso, verificado
- **Neutral**: `#827072` (marrom acinzentado) - Headers
- **Terciário**: `#D2CAC2` (bege) - Botões neutros
- **Warning**: `#FFA500` (laranja) - Não verificado

### 4.2 Tipografia
- **Fonte**: Plus Jakarta Sans (400, 500, 700, 800)
- **Hierarquia**:
  - H1: 24-32px, bold
  - H2: 20-24px, bold
  - Body: 14-16px, regular
  - Caption: 12-14px, medium

### 4.3 Componentes-Chave

#### Navigation Bar
- 3 abas fixas no topo:
  - Home (feed de pedidos)
  - Chats (mensagens)
  - Notificações (com badge de contador)
- Menu hamburger para perfil e configurações

#### Request Card
- Design em camadas com foto do usuário centralizada
- Badge de verificação próximo à foto (✅ verde ou 📧 cinza)
- Informações de data e distância em "pills" flutuantes
- CTAs em 3 cores distintas para clareza

#### Verification Badge
- **Verificado por Email**: ✅ Verde com tooltip "Email verificado"
- **Não verificado**: 📧 Cinza com tooltip "Apenas email"
- **Futuro - Telefone**: ⭐ Dourado com tooltip "Telefone verificado"

#### Floating Action Button
- Fixo no bottom-center
- "+ Pedir Item" sempre acessível
- Elevação e sombra para destaque

### 4.4 Fluxos Principais

#### Fluxo 1: Cadastro e Verificação
1. User escolhe Google ou Email
2. Se Email: recebe link de verificação
3. Clica no link e retorna ao app
4. Preenche perfil (nome, foto, endereço)
5. Sistema valida proximidade (geolocalização)
6. Badge "Email verificado" ✅ atribuído
7. Pode começar a usar (3 pedidos limit)

#### Fluxo 2: Criar Pedido
1. User toca FAB "+ Pedir Item"
2. Modal/página de formulário
3. Preenche campos obrigatórios
4. Preview do card
5. Confirma publicação
6. Redirecionamento para "Meus Pedidos"

#### Fluxo 3: Oferecer Ajuda
1. User vê pedido no feed
2. Verifica badge de verificação do solicitante
3. Toca "Ajudar"
4. Mensagem pré-preenchida no chat
5. Negociação de detalhes
6. Confirmação de encontro
7. Transação registrada automaticamente

#### Fluxo 4: Avaliação
1. Lender marca item como devolvido
2. Ambos recebem notificação push (FCM)
3. Formulário de avaliação (3 dias para completar)
4. Reputação atualizada automaticamente
5. Karma points creditados

---

## 5. Roadmap de Desenvolvimento

### Fase 1 - MVP (8 semanas)
**Objetivo**: Validar conceito com funcionalidades essenciais (100% gratuito)

#### Sprint 1-2: Infraestrutura (2 semanas)
- [ ] Setup Next.js + Vercel
- [ ] Configuração Firebase Auth (Email + Google OAuth)
- [ ] Modelo de dados inicial (Vercel Postgres)
- [ ] Design system base (Tailwind + components)

#### Sprint 3-4: Core Features (2 semanas)
- [ ] Autenticação via Email Link
- [ ] Sistema de badges de verificação
- [ ] CRUD de pedidos
- [ ] Feed de pedidos com filtros
- [ ] Sistema de geolocalização

#### Sprint 5-6: Interações (2 semanas)
- [ ] Sistema de chat (Firebase Realtime DB)
- [ ] Ofertas de ajuda
- [ ] Notificações push via FCM
- [ ] Gestão de transações

#### Sprint 7-8: Polimento (2 semanas)
- [ ] Sistema de avaliações
- [ ] Dashboard de perfil
- [ ] Sistema de karma/reputação
- [ ] PWA setup
- [ ] Testes e ajustes

### Fase 2 - Crescimento (4 semanas)
- [ ] Feed de eventos comunitários
- [ ] Sistema de badges e gamificação expandido
- [ ] Busca avançada e categorias
- [ ] Histórico completo de transações
- [ ] Modo offline (service workers)
- [ ] Sistema de convites (códigos de referência)

### Fase 3 - Monetização e Escala (6 semanas)
- [ ] **Verificação Premium via SMS** (pago)
  - Integração com Twilio ou serviço BR mais barato
  - Badge dourado ⭐ para verificados por telefone
  - Limite de pedidos aumentado para 10
- [ ] Integração com mapas (visualização de vizinhos)
- [ ] Chat de grupo para eventos
- [ ] Sistema de denúncias e moderação
- [ ] Analytics e métricas
- [ ] SEO e landing page pública
- [ ] Ads para sustentabilidade (Google AdSense)

---

## 6. Métricas de Sucesso

### KPIs Primários
- **Adoption Rate**: 20% dos usuários cadastrados realizam ≥1 transação em 30 dias
- **Transaction Completion**: 80% das ofertas aceitas resultam em empréstimo concluído
- **User Retention**: 40% dos usuários ativos no mês 1 permanecem no mês 3
- **Average Rating**: Reputação média da plataforma ≥4.2 estrelas
- **Verification Rate**: 70% dos usuários verificam email em 24h

### KPIs Secundários
- Tempo médio até primeira oferta: <2 horas
- Taxa de resposta no chat: >70% em <1 hora
- NPS (Net Promoter Score): ≥50
- Pedidos recorrentes: 30% dos usuários fazem ≥2 pedidos
- Taxa de conversão (cadastro → primeiro pedido): ≥50%

### Métricas Técnicas
- Core Web Vitals (mobile): >90 score
- Crash-free rate: >99.5%
- API response time: <500ms p95
- Push notification delivery: >95%
- Email verification link click: >60%

---

## 7. Riscos e Mitigações

### Risco 1: Baixa adoção inicial
**Impacto**: Alto | **Probabilidade**: Média

**Mitigações**:
- Parceria com administradores de condomínios para onboarding em massa
- Programa de embaixadores (early adopters ganham badges especiais)
- Campanha de "primeiro pedido" facilitada (sugestões de itens comuns)
- Sistema de convites com benefícios (convidar 3 amigos = badge especial)

### Risco 2: Fraudes sem verificação telefônica
**Impacto**: Alto | **Probabilidade**: Média

**Mitigações**:
- Sistema de reputação rigoroso desde o início
- Limites para não-verificados (3 pedidos ativos)
- Badges visíveis de verificação
- Sistema de karma progressivo (quanto mais transações, mais confiança)
- Denúncias priorizadas
- Validação de proximidade por GPS
- Sistema de convites (chain of trust)

### Risco 3: Itens não devolvidos
**Impacto**: Alto | **Probabilidade**: Média

**Mitigações**:
- Sistema de reputação rigoroso
- Lembretes automáticos de devolução
- Processo de denúncia simplificado
- Suspensão automática de reincidentes
- "Seguro social": comunidade pode banir usuários maliciosos

### Risco 4: Conteúdo inadequado
**Impacto**: Médio | **Probabilidade**: Baixa

**Mitigações**:
- Filtro de palavras proibidas
- Sistema de denúncias com revisão em 24h
- Moderação assistida por IA (detecção de padrões)
- Termos de uso claros com consequências

### Risco 5: Limites do plano gratuito
**Impacto**: Médio | **Probabilidade**: Alta (em crescimento)

**Mitigações**:
- Monitoramento de quotas em dashboard
- Alertas automáticos ao atingir 80% dos limites
- Plano de migração para planos pagos definido previamente
- Arquitetura preparada para sharding/scaling horizontal
- Implementar caching agressivo
- Otimizar queries e reduzir writes no Firestore

---

## 8. Considerações de Privacidade e Segurança

### Dados Sensíveis
- Endereços completos visíveis apenas após match (oferta aceita)
- Telefone compartilhado opcionalmente no chat (com consentimento explícito)
- Histórico de transações privado (visível apenas para envolvidos)
- Email nunca exibido publicamente

### LGPD Compliance
- Consentimento explícito para uso de localização
- Direito ao esquecimento (deletar conta e dados)
- Exportação de dados pessoais
- Política de privacidade clara e acessível
- Opção de perfil "oculto" (menos visível nas buscas)

### Segurança
- Rate limiting em endpoints sensíveis
- Validação server-side de todas as operações
- Sanitização de inputs (prevenção XSS)
- HTTPS obrigatório
- Tokens JWT com expiração curta (1h)
- Email verification obrigatória antes de criar pedidos
- Captcha em cadastro (Cloudflare Turnstile - gratuito)

---

## 9. Plano de Monetização Futura

### Fase Gratuita (MVP - Meses 1-6)
- 100% gratuito para validar produto
- Foco em crescimento de usuários
- Métricas de engajamento

### Fase Premium (Meses 7+)
**Verificação Premium**:
- Verificação por SMS: R$ 2,99 (one-time)
- Badge dourado ⭐
- Limite de 10 pedidos simultâneos
- Prioridade no feed

**Plano Pro** (R$ 9,90/mês):
- Tudo do Premium +
- Destaque em pedidos
- Analytics pessoal
- Suporte prioritário
- Sem ads

**Modelo Freemium**:
- 90% dos usuários permanecem gratuitos
- 10% convertem para Premium/Pro
- Projeção: 1000 usuários → 100 pagantes → ~R$ 1.000/mês

### Outras Fontes de Receita
- Google AdSense (discreto, não-intrusivo)
- Parcerias com lojas locais (cupons de desconto)
- Eventos patrocinados

---

## 10. Próximos Passos

### Pré-Desenvolvimento
1. ✅ PRD completo e aprovado
2. Validar designs com usuários (5-10 entrevistas)
3. Definir tech lead e squad
4. Setup de ambiente e repositório
5. Criar backlog detalhado no GitHub Projects

### Go-to-Market
1. Criar landing page explicativa
2. Pilotar em 1-2 condomínios parceiros
3. Coletar feedback iterativo (sprints quinzenais)
4. Lançamento público após validação do MVP
5. Campanha em redes sociais locais

### Milestones Importantes
- **Semana 8**: MVP completo (100% gratuito)
- **Mês 3**: 100 usuários ativos
- **Mês 6**: 500 usuários, decisão sobre monetização
- **Mês 12**: 2000 usuários, plano premium lançado

---

## 11. Anexos

### Referências de Design
- Arquivos HTML fornecidos (home.html, chat.html, perfil.html, meus-pedidos.html)
- Material Symbols para iconografia
- Plus Jakarta Sans como fonte principal

### Inspirações
- **Tem Açúcar**: Conceito de empréstimo hiperlocal
- **Nextdoor**: Foco em comunidades de bairro
- **Facebook Marketplace**: UX de listagens e mensagens
- **Airbnb**: Sistema de reputação bidirecional

### Recursos Técnicos
- [Firebase Email Link Auth](https://firebase.google.com/docs/auth/web/email-link-auth)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Firebase Cloud Messaging](https://firebase
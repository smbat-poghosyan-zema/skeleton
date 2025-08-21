# Agent Development Guide (Dynamic)

> **⚠️ CRITICAL**: This document MUST be updated during every task. Treat this as executable instructions, not just guidelines.

## 🔄 MANDATORY: Documentation Update Workflow

**Before starting ANY task:**
1. Read this entire document
2. Identify which sections might be affected by your changes
3. Check the **Dependency Matrix** for related components

**During task execution:**
1. Update **Last Updated** sections as you make changes
2. Add to **Critical Reminders** if you encounter common pitfalls
3. Update **Dependency Matrix** if you create new relationships

**After completing task:**
1. Update **CHANGELOG.md** with your changes
2. Update relevant sections in this document
3. Add any new patterns to **Knowledge Base**
4. Commit this file WITH your changes

## 📋 Project Context & Business Logic

### System Overview
**Purpose**: Restaurant menu management system for lunch coordination
**Core Workflow**: Admin manages restaurants/menus → Users browse and select → System tracks preferences

### Business Entities & Relationships
```
User (email, password, role: admin|user)
  ↓ (1:many - admins manage)
Restaurant (name, description, timestamps)
  ↓ (1:many - has menu items)
MenuItem (name, price, category, restaurant_ref)
```

### Key Business Rules
1. **Cascade Deletion**: Deleting restaurant removes ALL its menu items
2. **Role-Based Access**: Only admins can create/modify restaurants and menus
3. **Data Integrity**: MenuItem MUST reference valid restaurant
4. **Authentication**: JWT-based with bcrypt password hashing

### API Architecture
- **Authentication**: `/auth/login`, `/auth/register` (public)
- **Restaurants**: `/restaurants` (admin-only CUD, public read)
- **Menu Items**: `/restaurants/:id/menu` (admin-only CUD, public read)
- **Users**: `/users` (admin-only management)

## 🎯 Task Execution Workflows

### Adding New Authentication Features
1. **Dependencies**: `AuthModule` → `AuthService` → `JwtStrategy/LocalStrategy`
2. **Must Update**: Guards, decorators, JWT payload structure
3. **Test**: Login flow, protected routes, role-based access
4. **Frontend Impact**: Update auth context, API calls

### Database Schema Changes
1. **⚠️ CRITICAL**: Update BOTH schema file AND DTO files
2. **Cascade Check**: Verify relationships don't break
3. **Migration**: Consider data migration needs
4. **Service Layer**: Update service methods
5. **API Layer**: Update controllers and validation

### Adding New API Endpoints
1. **Service First**: Implement business logic in service
2. **Controller**: Add endpoint with proper guards/decorators
3. **DTO**: Create/update request/response DTOs
4. **Module**: Register in appropriate module
5. **Frontend**: Update API client

### Frontend Component Changes
1. **Check**: Existing patterns in `src/` structure
2. **Dependencies**: Update API calls if backend changed
3. **State**: Consider global state impact
4. **Styling**: Follow Tailwind utility patterns

### Cross-Stack Features
**Order of Implementation:**
1. Database schema/models
2. Backend services
3. Backend controllers/API
4. Frontend API integration
5. Frontend UI components
6. End-to-end testing

## 🔗 Dependency Matrix

| Component | Directly Affects | Indirectly Affects | ⚠️ Breaking Changes |
|-----------|-----------------|-------------------|-------------------|
| **User Schema** | AuthService, UsersService | All protected routes | JWT payload structure |
| **Restaurant Schema** | RestaurantsService, MenuService | MenuItem cascade deletion | API response format |
| **MenuItem Schema** | MenuService | Restaurant relationships | Menu API responses |
| **AuthModule** | All guards, protected routes | Frontend auth state | Login/logout flow |
| **JWT Strategy** | All protected endpoints | Frontend token handling | Authentication headers |
| **Environment Config** | Database connection, JWT secret | Docker setup | App startup |

## 🚨 Critical Reminders

### Common Pitfalls (Auto-Updated)
- **Last Updated**: [Initial] 
- **Forgot to update DTOs** when changing schemas → API validation errors
- **Missing cascade deletion** when removing restaurants → orphaned menu items
- **Hardcoded role checks** instead of using guards → security vulnerabilities
- **Frontend auth state out of sync** → user sees wrong UI state

### Security Checklist
- [ ] Password fields have `select: false` in schema
- [ ] JWT tokens include user ID and role
- [ ] Protected routes use `@UseGuards(JwtAuthGuard)`
- [ ] Admin routes use `@UseGuards(JwtAuthGuard, RolesGuard)`
- [ ] Input validation via DTOs with class-validator

### Performance Notes
- MenuItem queries filtered by restaurant ID (indexed)
- User lookups by email (unique index)
- Avoid N+1 queries when populating relationships

## 📚 Knowledge Base

### Quick Reference Commands
```bash
# Development
cd backend && npm run start:dev
cd frontend && npm run dev
docker compose up --build

# Testing & Quality
npm run lint
npm run test
npm run build
```

### NestJS Patterns Used
- **Guards**: `JwtAuthGuard`, `RolesGuard` for protection
- **Decorators**: `@Roles()`, `@UseGuards()` for authorization
- **DTOs**: Class-validator for request validation
- **Schemas**: Mongoose with timestamps, indexing

### Frontend Patterns
- **Structure**: Feature-based organization planned
- **Styling**: Tailwind CSS utility classes
- **State**: Context API or Redux (TBD)

### Common Code Patterns
```typescript
// Service method pattern
async findOne(id: string) {
  const entity = await this.model.findById(id).exec();
  if (!entity) {
    throw new NotFoundException('Entity not found');
  }
  return entity;
}

// Controller with guards pattern
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post()
async create(@Body() dto: CreateDto) {
  return this.service.create(dto);
}
```

### Troubleshooting Guide

**MongoDB Connection Issues**:
- Check `MONGO_URI` environment variable
- Verify MongoDB is running (Docker: `docker compose ps`)
- Check network connectivity

**JWT Authentication Failing**:
- Verify `JWT_SECRET` is set
- Check token format in frontend requests
- Validate user exists and role is correct

**CORS Issues**:
- Backend enables CORS for frontend origin
- Check frontend API base URL configuration

## 🏗️ Architecture Guidelines

### Module Structure (NestJS)
```
src/
  <feature>/
    dto/           # Request/response validation
    schemas/       # Database models
    <feature>.controller.ts
    <feature>.service.ts
    <feature>.module.ts
```

### Database Design Principles
- Use timestamps on all entities
- Index foreign keys for performance
- Implement proper cascade deletion
- Validate required fields at schema level

### API Design Standards
- RESTful endpoints with proper HTTP methods
- Consistent error handling with NestJS exceptions
- Request/response validation via DTOs
- Authentication on all protected routes

### Frontend Architecture (Planned)
```
src/
  components/    # Reusable UI components
  features/      # Feature-specific components
  hooks/         # Custom React hooks
  services/      # API integration
  types/         # TypeScript definitions
```

---

## 📝 Update Log
**Last Major Update**: Initial creation
**Next Review**: After 10 tasks or major architecture changes

**Recent Changes Log**:
- [Initial] - Created dynamic structure with business context
- [Add your changes here when modifying this document]


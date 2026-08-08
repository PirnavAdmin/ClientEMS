# syntax=docker/dockerfile:1.7

# ==========================
# Restore
# ==========================
FROM mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim AS restore

WORKDIR /src

COPY EmployeeManagementSystem.csproj ./

RUN dotnet restore "EmployeeManagementSystem.csproj"


# ==========================
# Build
# ==========================
FROM restore AS build

COPY . ./

RUN dotnet publish "EmployeeManagementSystem.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# ==========================
# Runtime
# ==========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS runtime

WORKDIR /app

ENV ASPNETCORE_URLS=http://+:5000
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV HOME=/tmp

# ==========================
# LibreOffice + Required Fonts
# ==========================
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libreoffice-writer \
        libreoffice-core \
        libreoffice-common \
        fonts-liberation2 \
        fonts-crosextra-carlito \
        fonts-crosextra-caladea \
        fonts-noto \
        fontconfig \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*


# ==========================
# Application
# ==========================
COPY --from=build /app/publish ./

COPY --from=build /src/Templates ./Templates


# ==========================
# Required Directories
# ==========================
RUN mkdir -p \
        /app/GeneratedLetters \
        /app/GeneratedPayslips \
        /app/wwwroot/GeneratedPayslips \
        /app/wwwroot/uploads \
        /app/wwwroot/uploads/assets \
        /tmp/libreoffice-profile


# ==========================
# Permissions
# ==========================
RUN chown -R ${APP_UID}:${APP_UID} \
        /app \
        /tmp/libreoffice-profile

USER ${APP_UID}

EXPOSE 5000

ENTRYPOINT ["dotnet", "EmployeeManagementSystem.dll"]
---
title: "Connecting to Korifi on a KinD Cluster Using Go"
meta_title: "How to Connect to Korifi on KinD Using Go"
description: "Learn how to connect to Korifi on a KinD cluster using Go. This guide explains the differences in authentication between Cloud Foundry and Korifi, challenges faced, and step-by-step instructions with code examples."
date: 2025-03-31T15:15:00Z
image: "/images/blog/go_korifi.png"
categories: ["Cloud Foundry", "Kubernetes", "Go Programming"]
author: "Gloria Ciavarrini"
tags: ["Korifi", "kubernetes", "kind", "cloudfoundry", "go"]
draft: false
---

In this post, I'll explain how to connect to _Korifi_ on a KinD cluster using Go,
addressing the challenges and differences in authentication between Cloud
Foundry and _Korifi_.

## What is _Korifi_

[_Korifi_](https://www.cloudfoundry.org/technology/_Korifi_/) is an open-source
Platform-as-a-Service (PaaS) developed by the Cloud Foundry community to
simplify Kubernetes for developers. It provides a Cloud Foundry-compatible
abstraction over Kubernetes, enabling developers to focus on building
applications without worrying about the complexities of container orchestration.
With features like automated networking, security, and the simplicity of the cf
push command, _Korifi_ bridges the gap between Cloud Foundry and Kubernetes
environments

## The Problem

Connecting to _Korifi_ Using Traditional Cloud Foundry Methods When transitioning
from Cloud Foundry to _Korifi_, developers face authentication challenges. The
familiar OAuth token-based approach doesn't work with _Korifi_'s Kubernetes-native
authentication system.

### Differences in Authentication: Cloud Foundry vs. _Korifi_

- **Cloud Foundry**  
    Uses OAuth tokens for authentication. Developers authenticate using commands
    like `cf auth username password`, and the system generates an access token for API
    interactions.

- **Korifi**  
    Adopts Kubernetes-native authentication methods, primarily relying on client
    certificates stored in the `kubeconfig` file. This approach aligns with
    Kubernetes' security model but requires developers to extract and manage
    certificate data manually

## The Goal

✅ Understand the authentication differences between Cloud Foundry and _Korifi_.  
✅ Extract and use client certificates from the Kubernetes config file.  
✅ Using a Go client to connect to _Korifi_ on a KinD cluster! 🚀

## The Solution

First, let's install _Korifi_ on a KinD cluster following the [official
installation
instructions](https://github.com/cloudfoundry/_Korifi_/blob/main/INSTALL.kind.md).
Once _Korifi_ is installed, we'll create a Go project to build a client capable of
authenticating with _Korifi_.

### Step 1: Setup a Go project

```bash
mkdir korifi-client
cd korifi-client
go mod init korifi-client
```

### Step 2: Load Kubernetes Configuration

Add the following function to your `main.go` file. This function loads the
Kubernetes configuration file (`kubeconfig`) from your home directory.

```go
func getKubeConfig() (*api.Config, error) {
	home := homedir.HomeDir()
	kubeconfig := filepath.Join(home, ".kube", "config")

	// Load kubeconfig
	config, err := clientcmd.LoadFromFile(kubeconfig)
	if err != nil {
		fmt.Printf("Error loading kubeconfig: %v\n", err)
		return nil, err
	}
	return config, nil
}
```

### Step 3: Extract Client Certificates

Create a function that extracts the client certificate and key for the
`kind-_Korifi_` user context from the Kubernetes configuration file. It encodes
the certificate data in Base64 format for use in HTTP requests.

```go
func getPEMCertificate(config *api.Config) (string, error) {
	var dataCert, keyCert []byte

	// Find the desired user context (in this case, "kind-_Korifi_")
	for username, authInfo := range config.AuthInfos {
		if username == "kind-korifi" {
			dataCert = authInfo.ClientCertificateData
			keyCert = authInfo.ClientKeyData
			break
		}
	}

	if len(dataCert) == 0 || len(keyCert) == 0 {
		return "", fmt.Errorf("could not find certificate data for kind-Korifi")
	}

	return base64.StdEncoding.EncodeToString(append(dataCert, keyCert...)), nil
}
```


### Step 4: Configure an HTTP Client
To interact with Korifi’s APIs securely, we need an HTTP client that uses the
extracted certificate for authentication. This requires implementing a custom
`RoundTripper`.

A `RoundTripper` is an interface in Go 
```go
type RoundTripper interface {
    RoundTrip(*Request) (*Response, error)
}
```
that allows customization of HTTP request
execution. It acts like middleware for HTTP clients, enabling you to modify
requests before they are sent or responses before they are returned.

Here’s how we implement it:

```go
type authHeaderRoundTripper struct {
	certPEM string
	base    http.RoundTripper
}

func (t *authHeaderRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	reqClone := req.Clone(req.Context())
	reqClone.Header.Set("Authorization", "ClientCert "+t.certPEM)
	return t.base.RoundTrip(reqClone)
}
```

now we are ready to create an HTTP client using this custom `RoundTripper`:

```go
func getKorifiHttpClient() (*http.Client, error) {
	config, err := getKubeConfig()
	if err != nil {
		return nil, err
	}

	certPEM, err := getPEMCertificate(config)
	if err != nil {
		return nil, err
	}

	// Create a custom transport with TLS settings
	transport := &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true, // Use with caution in production environments
		},
	}

	// Add Authorization header the RoundTripper
	roundTripper := &authHeaderRoundTripper{
		certPEM: certPEM,
		base:    transport,
	}

	return &http.Client{
		Transport: roundTripper,
	}, nil
}
```

### Step 5: Invoke Korifi Endpoints

Use the HTTP client to call an example endpoint (`/v3/info`) on your _Korifi_
instance. This is how you can interact with _Korifi_ APIs.

```go
// Define InfoV3Response struct based on API response fields.
type InfoV3Response struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

func getInfo(httpClient *http.Client) (*InfoV3Response, error) {
	resp, err := httpClient.Get("https://localhost/v3/info")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("request failed with status %d: %s", resp.StatusCode, resp.Status)
	}

	var info InfoV3Response

	err = json.NewDecoder(resp.Body).Decode(&info)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling info: %w", err)
	}

	return &info, nil
}
```

### Step 6: Run Your Client

Finally, add a `main` function to initialize the HTTP client and call the `/v3/info`
endpoint:

```go
func main() {
	client, err := getKorifiHttpClient()
	if err != nil {
		fmt.Printf("Error creating HTTP client: %v\n", err)
		return
	}

	info, err := getInfo(client)
	if err != nil {
		fmt.Printf("Error getting info: %v\n", err)
		return
	}

	fmt.Printf("Korifi Info: %+v\n", info)
}
```


Run your program using:

```bash
go run main.go
```

and check the result:

```bash
Korifi Info: &{Name:korifi Version:v0.15.0}
```

### The Result

Once executed successfully:
* The program connects to _Korifi_ using Kubernetes-native authentication.
* It fetches information from the `/v3/info` endpoint and prints it.

By following this guide step-by-step, you can programmatically interact with
_Korifi_ APIs using Go! 🚀

## Resources

The complete source code for this project is available on GitHub: [Korifi Go
Client Repository](https://github.com/gciavarrini/korifi-go-client)

Feel free to explore, contribute, or raise any issues you encounter while using
the code!

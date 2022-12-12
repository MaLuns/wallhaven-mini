import AbstractApi from "./core/abstractApi";
import CloudApi from "./core/cloudApi";
import HttpApi from "./core/httpApi";

class ConcreteFactory {
    private static singletons: Record<string, AbstractApi> = {}

    private static instances: { [key: string]: new () => AbstractApi } = {
        "CloudApi": CloudApi,
        "HttpApi": HttpApi
    }

    public static getInstance(key: string): AbstractApi {
        if (!ConcreteFactory.singletons[key]) {
            let instance = ConcreteFactory.instances[key as keyof typeof ConcreteFactory.instances]
            ConcreteFactory.singletons[key] = new instance()
        }
        return ConcreteFactory.singletons[key]
    }
}

export default ConcreteFactory